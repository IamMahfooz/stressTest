// helper server -1
package main

import (
	"compileServer1/utils"
	"fmt"
	"github.com/labstack/echo/v4"
)

func main() {

	//curl command to test the full feature
	//curl -H 'Content-Type: application/json' -X POST http://localhost:5001/compile -d '{
	//"cid": "ARC171",
	//	"pid": "A",
	//	"ucode": "#include<bits/stdc++.h>\nusing namespace std;\n#define int long long\nconst int maxn = 100010;\nint T,n,a,b;\nsigned main(){\n\tcin>>T;\n\twhile(T--){\n\t\tcin>>n>>a>>b;\n\t\tif(a>=n/2){\n\t\t\tputs(b>(n-a)*(n-a) ? \"No\" : \"Yes\");\n\t\t}else{\n\t\t\tint Sp=n-a*2;\n\t\t\tputs(b>a*(n-a)+(a+Sp)*((Sp+1)/2) ? \"No\" : \"Yes\");\n\t\t}\n\t}\n}",
	//	"firstLineIsNumTests": true,
	//	"numLinesPerTestCase": 1,
	//	"numLinesPerOutput": 1
	//}'

	//Step 0: Start the server
	e := echo.New()
	e.POST("/compile", utils.StartProcess)
	err := e.Start(":5001")
	if err != nil {
		fmt.Println("error while starting server : ", err.Error())
		return
	}
	//fmt.Println("Starting the server at : 5001")
}
