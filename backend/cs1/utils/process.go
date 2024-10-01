package utils

import (
	"fmt"
	"io/ioutil"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
)

func ProcessTestCase(binaryPath, testCasesDir, fileName string, req *Request, failingCases *FTestMaps, mu *sync.Mutex) error {
	fmt.Println("starting file : ", fileName)
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
	if req.FirstLineIsNumTests == true {
		input = input[strings.IndexByte(string(input), 10)+1:]
	}
	inputSections := splitIntoSections(string(input), req.NumLinesPerTestCase)
	expectedSections := splitIntoSections(string(expectedOutput), req.NumLinesPerOutput)
	actualSections := splitIntoSections(string(actualOutput), req.NumLinesPerOutput)

	var localFailingCases FTestMaps

	// Identify failing cases for the current file
	for i := 0; i < len(inputSections); i++ {
		if expectedSections[i] != actualSections[i] {
			localFailingCases = append(localFailingCases, struct {
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

	// Lock the shared data structure before appending to maintain order
	mu.Lock()
	*failingCases = append(*failingCases, localFailingCases...)
	mu.Unlock()
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
