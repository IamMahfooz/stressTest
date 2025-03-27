package utils

import (
	"fmt"
	"math/rand"
	"strconv"
	"sync"

	"github.com/labstack/echo/v4"
)

type FTestMaps struct {
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
	var mu sync.Mutex

	// Step 1: Get the request payload
	req := new(Request)
	if err := c.Bind(req); err != nil {
		return c.JSON(400, "Invalid request")
	}
	fmt.Println("the request struct was : \n", req)

	// Step 2: Fetch contest ID, submission code, and problem ID
	contestID := req.CID
	problemID := req.PID
	submissionCode := req.SubCode

	// Step 3: Compile the user's submission code
	binaryPath, err := CompileSubmission(submissionCode, uniqueIdentifier)
	if err != nil {
		FullWipeOut(strconv.Itoa(uniqueIdentifier))
		return c.JSON(500, "Failed to compile submission")
	}
	fmt.Println("completed step 3")

	// Step 4: Fetch the test cases
	testCasesDir, err := FetchTestcases(contestID, problemID, uniqueIdentifier)
	if err != nil {
		FullWipeOut(strconv.Itoa(uniqueIdentifier))
		return c.JSON(500, "Failed to fetch test cases")
	}
	fmt.Println("completed step 4 ")

	// Step 5: Execute test cases and collect failing cases
	failingCasesMaps := make(map[int][]*FTestMaps)
	err = ExecuteTestCases(binaryPath, testCasesDir, req, failingCasesMaps, &mu)
	if err != nil {
		FullWipeOut(strconv.Itoa(uniqueIdentifier))
		return c.JSON(500, "Failed to execute test cases")
	}
	fmt.Println("completed step 5")

	var failingCases []FTestMaps
	for i := 0; i < len(failingCasesMaps); i++ {
		for _, testCase := range failingCasesMaps[i] {
			failingCases = append(failingCases, *testCase)
		}
	}

	// Step 7 : Struct to json File
	//fileJson, err := os.Create("./result" + strconv.Itoa(uniqueIdentifier) + ".json")
	//if err != nil {
	//	fmt.Println("error while creating json file", err)
	//}
	//defer func(fileJson *os.File) {
	//	err := fileJson.Close()
	//	if err != nil {
	//		fmt.Println("error while closing json file")
	//	}
	//}(fileJson)
	//b, err := json.Marshal(failingCases)
	//if err != nil {
	//	fmt.Println("error while marshalling failing cases", err)
	//}
	//_, err = fileJson.Write(b)
	//if err != nil {
	//	fmt.Println("error while writing json file", err)
	//}

	// Step 6: Send the failing test cases back as JSON
	FullWipeOut(strconv.Itoa(uniqueIdentifier))
	return c.JSON(200, failingCases)
}
