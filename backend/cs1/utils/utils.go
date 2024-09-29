package utils

import (
	"archive/zip"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"github.com/labstack/echo/v4"
)

type FTestMaps []struct {
	Input        string `json:"in"`
	SystemOutput string `json:"sOut"`
	UserOutput   string `json:"uOut"`
}

type Request struct {
	CID                 string `json:"cid"`
	PID                 string `json:"pid"`
	SubCode             string `json:"ucode"`
	FirstLineIsNumTests bool   `json:"firstLineIsNumTests"`
	NumLinesPerTestCase int    `json:"numLinesPerTestCase"`
	NumLinesPerOutput   int    `json:"numLinesPerOutput"`
}

func StartProcess(c echo.Context) error {
	uniqueIdentifier := rand.Intn(8000000)

	// Step 1: Get the request payload
	req := new(Request)
	if err := c.Bind(req); err != nil {
		return c.JSON(400, "Invalid request")
	}

	// Step 2: Fetch contest ID, submission code, and problem ID
	contestID := req.CID
	problemID := req.PID
	submissionCode := req.SubCode

	// Step 3: Compile the user's submission code
	binaryPath, err := CompileSubmission(submissionCode, uniqueIdentifier)
	if err != nil {
		return c.JSON(500, "Failed to compile submission")
	}

	// Step 4: Fetch the test cases
	testCasesDir, err := FetchTestcases(contestID, problemID, uniqueIdentifier)
	if err != nil {
		return c.JSON(500, "Failed to fetch test cases")
	}

	// Step 5: Execute test cases and collect failing cases
	var failingCases FTestMaps
	err = ExecuteTestCases(binaryPath, testCasesDir, req, &failingCases)
	if err != nil {
		return c.JSON(500, "Failed to execute test cases")
	}

	// Step 6: Send the failing test cases back as JSON
	return c.JSON(200, failingCases)
}

func CompileSubmission(code string, uIdentify int) (string, error) {
	// Compile the code and return the binary path
	binaryPath := "./compiled_binary" + strconv.Itoa(uIdentify)
	subFile := "submission" + strconv.Itoa(uIdentify) + ".cpp"
	err := ioutil.WriteFile(subFile, []byte(code), 0644)
	if err != nil {
		return "", err
	}

	cmd := exec.Command("g++", subFile, "-o", binaryPath)
	err = cmd.Run()
	if err != nil {
		return "error compiling the binary", err
	}

	return binaryPath, nil
}

func FetchTestcases(contestID, problemID string, uIdentify int) (string, error) {
	// Fetch the test cases from the server and return the directory path

	// make a database to fetch urlId according to contestID ; every problem id has its own unique link identifier
	problemUniqueId := "AABE4bXm7hDlF4CZt0DfUtL-a" // ARC171-A
	finalUrl := "https://www.dropbox.com/sh/nx3tnilzqz7df8a/" + problemUniqueId + "/" + contestID + "/" + problemID + "?dl=1"
	fmt.Println("final url was : ", finalUrl)
	testCaseFolder := "./" + strconv.Itoa(uIdentify) + ".zip"
	err := downloadFile(testCaseFolder, finalUrl)
	if err != nil {
		fmt.Println("error while downloading zip file ; error :: ", err.Error())
		return "", err
	}
	err = unzipFolder(testCaseFolder, uIdentify)
	if err != nil {
		fmt.Println("error while unzipping zip file ; error :: ", err.Error())
	}
	fmt.Println("downloaded the zip file")
	return testCaseFolder, nil
}

func ExecuteTestCases(binaryPath, testCasesDir string, req *Request, failingCases *FTestMaps) error {
	var wg sync.WaitGroup
	files, err := ioutil.ReadDir(filepath.Join(testCasesDir, "in"))
	if err != nil {
		return err
	}

	for _, file := range files {
		if !file.IsDir() {
			wg.Add(1)
			go func(fileName string) {
				defer wg.Done()
				err := ProcessTestCase(binaryPath, testCasesDir, fileName, req, failingCases)
				if err != nil {
					fmt.Println("Error processing test case:", err)
				}
			}(file.Name())
		}
	}

	wg.Wait()
	return nil
}

func ProcessTestCase(binaryPath, testCasesDir, fileName string, req *Request, failingCases *FTestMaps) error {
	// Execute the test case and compare outputs
	inputFilePath := filepath.Join(testCasesDir, "in", fileName)
	outputFilePath := filepath.Join(testCasesDir, "out", fileName)

	input, err := ioutil.ReadFile(inputFilePath)
	if err != nil {
		return err
	}

	expectedOutput, err := ioutil.ReadFile(outputFilePath)
	if err != nil {
		return err
	}

	cmd := exec.Command(binaryPath)
	cmd.Stdin = strings.NewReader(string(input))

	actualOutput, err := cmd.CombinedOutput()
	if err != nil {
		return err
	}

	// Split and compare outputs based on user-provided details
	//os.Truncate(string(input), 6)
	if req.FirstLineIsNumTests == true {
		input = input[strings.IndexByte(string(input), 10)+1:]
	}
	inputSections := splitIntoSections(string(input), req.NumLinesPerTestCase)
	expectedSections := splitIntoSections(string(expectedOutput), req.NumLinesPerOutput)
	actualSections := splitIntoSections(string(actualOutput), req.NumLinesPerOutput)

	for i := 0; i < len(inputSections); i++ {
		if expectedSections[i] != actualSections[i] {
			*failingCases = append(*failingCases, struct {
				Input        string `json:"in"`
				SystemOutput string `json:"sOut"`
				UserOutput   string `json:"uOut"`
			}{
				Input:        inputSections[i],
				SystemOutput: expectedSections[i],
				UserOutput:   actualSections[i],
			})
			fmt.Println("input : ", inputSections[i])
			fmt.Println("expected : ", expectedSections[i])
			fmt.Println("actual : ", actualSections[i])
			fmt.Println("------------------------------")
		}
	}
	//fmt.Println("the failing testcases were : \n ", *failingCases)
	return nil
}

func splitIntoSections(content string, linesPerSection int) []string {
	// Split the content into sections based on the number of lines per section
	lines := strings.Split(content, "\n")
	var sections []string
	for i := 0; i < len(lines); i += linesPerSection {
		end := i + linesPerSection
		if end > len(lines) {
			end = len(lines)
		}
		sections = append(sections, strings.Join(lines[i:end], "\n"))
	}
	return sections
}

func downloadFile(filepath string, url string) (err error) {

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer func(out *os.File) {
		err := out.Close()
		if err != nil {
			return
		}
	}(out)

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	// Check server response
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	// Writer the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	return nil
}
func unzipFolder(folderPath string, uIdentify int) error {
	// Open a zip archive for reading.
	r, err := zip.OpenReader(folderPath)
	if err != nil {
		log.Fatalf("impossible to open zip reader: %s", err)
	}
	defer func(r *zip.ReadCloser) {
		err := r.Close()
		if err != nil {
			return
		}
	}(r)

	// Iterate through the files in the archive,
	for k, f := range r.File {
		//fmt.Printf("Unzipping %s:\n", f.Name)
		rc, err := f.Open()
		if err != nil {
			log.Fatalf("impossible to open file n°%d in archine: %s", k, err)
		}
		defer func(rc io.ReadCloser) {
			err := rc.Close()
			if err != nil {

			}
		}(rc)
		// define the new file path
		//fmt.Println("file name was : ", f.Name)
		newFilePath := fmt.Sprintf("testcases_"+strconv.Itoa(uIdentify)+"/%s", f.Name)

		// CASE 1 : we have a directory
		if f.FileInfo().IsDir() {
			// if we have a directory we have to create it
			err = os.MkdirAll(newFilePath, 0777)
			if err != nil {
				log.Fatalf("impossible to MkdirAll: %s", err)
			}
			// we can go to next iteration
			continue
		}

		// CASE 2 : we have a file
		// create new uncompressed file
		uncompressedFile, err := os.Create(newFilePath)
		if err != nil {
			log.Fatalf("impossible to create uncompressed: %s", err)
		}
		_, err = io.Copy(uncompressedFile, rc)
		if err != nil {
			log.Fatalf("impossible to copy file n°%d: %s", k, err)
		}
	}
	// finally , remove the zip folder
	err = os.RemoveAll(folderPath)
	if err != nil {
		fmt.Println("error while deleting the zip folder : ", err)
		return err
	}
	return nil
}
