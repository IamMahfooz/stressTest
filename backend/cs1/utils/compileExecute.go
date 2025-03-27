package utils

import (
	"fmt"
	"io/ioutil"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
)

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

	return binaryPath, err
}

func ExecuteTestCases(binaryPath, testCasesDir string, req *Request, failingCases map[int][]*FTestMaps, mu *sync.Mutex) error {
	var wg sync.WaitGroup
	files, err := ioutil.ReadDir(filepath.Join(testCasesDir, "in"))
	if err != nil {
		fmt.Println("error while joining path of testcase directory", testCasesDir)
		return err
	}

	for i, file := range files {
		fmt.Println("starting with file : ", file.Name())
		if !file.IsDir() {
			wg.Add(1)
			go func(fileName string) {
				defer wg.Done()
				err := ProcessTestCase(binaryPath, testCasesDir, fileName, req, i, failingCases, mu)
				if err != nil {
					fmt.Println("Error processing test case:", err)
				}
			}(file.Name())
		}
	}
	wg.Wait()
	return nil
}
