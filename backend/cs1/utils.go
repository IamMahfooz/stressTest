package main

import (
	// "encoding/json"
	"math/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"

	"github.com/labstack/echo/v4"
)

type fTestMaps []struct {
	Input        string `json:"in"`
	SystemOutput string `json:"sOut"`
	UserOutput   string `json:"uOut"`
}

type Request struct {
	SubmissionLink      string `json:"submissionLink"`
	FirstLineIsNumTests bool   `json:"firstLineIsNumTests"`
	NumLinesPerTestCase int    `json:"numLinesPerTestCase"`
	NumLinesPerOutput   int    `json:"numLinesPerOutput"`
}

func startProcess(c echo.Context) error {
	// Step 1: Get the request payload
	req := new(Request)
	if err := c.Bind(req); err != nil {
		return c.JSON(400, "Invalid request")
	}

	// Step 2: Fetch contest ID, submission code, and problem ID
	contestID, problemID, submissionCode, err := fetchSubmissionDetails(req.SubmissionLink)
	if err != nil {
		return c.JSON(500, "Failed to fetch submission details")
	}

	// Step 3: Compile the user's submission code
	binaryPath, err := compileSubmission(submissionCode)
	if err != nil {
		return c.JSON(500, "Failed to compile submission")
	}

	// Step 4: Fetch the test cases
	testCasesDir, err := fetchTestcases(contestID, problemID)
	if err != nil {
		return c.JSON(500, "Failed to fetch test cases")
	}

	// Step 5: Execute test cases and collect failing cases
	var failingCases fTestMaps
	err = executeTestCases(binaryPath, testCasesDir, req, &failingCases)
	if err != nil {
		return c.JSON(500, "Failed to execute test cases")
	}

	// Step 6: Send the failing test cases back as JSON
	return c.JSON(200, failingCases)
}

func fetchSubmissionDetails(link string) (string, string, string, error) {
	// Logic to extract contest ID, problem ID, and submission code from the link
	resp ,err := http.NewRequest("POST",link,nil)
	if err!=nil{
		fmt.Println("found error while fetchig submission details ",err)
		return "","","",err
	}
	defer resp.Body.Close()
	var body []byte
	_,err= resp.Body.Read(body)
	if err != nil{
		fmt.Println("found error while fetchig submission details ",err)
		return "","","",err
	}
	var subDetails struct{
		Cid string `json:"cid"`
		Pid string `json:"pid"`
		Code string `json:"code"`
	}
	err = json.Unmarshal([]byte(body),&subDetails)
		if err != nil{
		fmt.Println("found error while fetchig submission details ",err)
		return "","","",err
	}
	return subDetails.Cid, subDetails.Pid, subDetails.Code, nil
}

func compileSubmission(code string) (string, error) {
	// Compile the code and return the binary path
	binaryPath := "./compiled_binary"+string(rand.Intn(8000000))
	subfile := "submission"+string(rand.Intn(80000))+".cpp"
	err := ioutil.WriteFile(subfile, []byte(code), 0644)
	if err != nil {
		return "", err
	}

	cmd := exec.Command("g++", subfile, "-o", binaryPath)
	err = cmd.Run()
	if err != nil {
		return "", err
	}

	return binaryPath, nil
}

func fetchTestcases(contestID, problemID string) (string, error) {
	// Fetch the test cases from the server and return the directory path

	testCasesDir := "./testcases"
	return testCasesDir, nil
}

func executeTestCases(binaryPath, testCasesDir string, req *Request, failingCases *fTestMaps) error {
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
				err := processTestCase(binaryPath, testCasesDir, fileName, req, failingCases)
				if err != nil {
					fmt.Println("Error processing test case:", err)
				}
			}(file.Name())
		}
	}

	wg.Wait()
	return nil
}

func processTestCase(binaryPath, testCasesDir, fileName string, req *Request, failingCases *fTestMaps) error {
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
		}
	}

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
