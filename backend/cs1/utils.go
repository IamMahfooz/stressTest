package main

import (
	// "encoding/json"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"math/rand"
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
	CID string `json:"cid"`
	PID string `json:"pid"`
	SubCode string `json:"ucode"`
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
	contestID := req.CID
	problemID:=req.PID
	submissionCode := req.SubCode

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
		return "error compiling the binary", err
	}

	return binaryPath, nil
}

func fetchTestcases(contestID, problemID string) (string, error) {
	// Fetch the test cases from the server and return the directory path

	req,err := http.NewRequest("POST","https://api.dropboxapi.com/2/files/list_folder",bytes.NewBuffer([]byte("")))
	if err !=nil{
		fmt.Println("error while preparing request")
	}
	req.Header.Add("Dropbox-API-Arg",`{"url": "https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?dl=0", "path": "/ABC100/A/in/in02.txt"}`)
	client := &http.Client{}
	res,err := client.Do(req)
	if err != nil{
		fmt.Println("error fetching the response")
	}
	defer res.Body.Close()



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
