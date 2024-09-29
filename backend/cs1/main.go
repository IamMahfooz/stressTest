// helper server -1
package main

import (
	"compileServer1/utils"
	"fmt"
	"github.com/labstack/echo/v4"
)

func main() {
	//_, err := utils.FetchTestcases("2019ddccqual", "A", 20119)
	//if err != nil {
	//	fmt.Println(err)
	//}

	//inbytes, err := os.ReadFile("./testcases_20119/in/in01.txt")
	//if err != nil {
	//	fmt.Println(err)
	//}
	//fmt.Println("the string was : ", inbytes)
	////truncatedBytes = inbytes[:]
	//fmt.Println(strings.IndexByte(string(inbytes), 10))
	//newByte := inbytes[strings.IndexByte(string(inbytes), 10)+1:]
	//fmt.Println("the string was : ", string(newByte))

	// testing compile
	//subCode := "#include\"bits/stdc++.h\"\nusing namespace std;\n#define int long long\nconst int maxn = 100010;\nint T,n,a,b;\nsigned main(){\n\tcin>>T;\n\twhile(T--){\n\t\tcin>>n>>a>>b;\n\t\tif(a>=n/2){\n\t\t\tputs(b>(n-a)*(n-a)?\"No\":\"Yes\");\n\t\t}else{\n\t\t\tint Sp=n-a*2;\n\t\t\tputs(b>a*(n-a)+(a+Sp)*((Sp+1)/2)?\"No\":\"Yes\");\n\t\t}\n\t}\n}"
	//_, err := utils.CompileSubmission(subCode, 20119)
	//if err != nil {
	//	fmt.Println(err)
	//	return
	//}
	//_, err := utils.FetchTestcases("ARC171", "A", 20119)
	//if err != nil {
	//	fmt.Println(err)
	//}

	//testing execution and processing of testcases
	//bPath := "/home/mahfooz/Desktop/stress-testV2/backend/cs1/compiled_binary20119"
	//testDirPath := "/home/mahfooz/Desktop/stress-testV2/backend/cs1/testcases_20119"
	//fmaps := utils.FTestMaps{}
	//req := utils.Request{
	//	CID:                 "ARC171",
	//	PID:                 "A",
	//	SubCode:             "",
	//	FirstLineIsNumTests: true,
	//	NumLinesPerTestCase: 1,
	//	NumLinesPerOutput:   1,
	//}
	//err := utils.ExecuteTestCases(bPath, testDirPath, &req, &fmaps)
	//if err != nil {
	//	fmt.Println(err)
	//	return
	//}

	//Step 0: Start the server
	e := echo.New()
	e.POST("/compile", utils.StartProcess)
	err := e.Start(":5001")
	if err != nil {
		fmt.Println("error while starting server : ", err.Error())
		return
	}
	fmt.Println("Starting the server at : 5001")
}
