// master server - entry point of backend request

package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"encoding/json"
	"github.com/labstack/echo/v4"
	"os"
)
type Request struct {
	CID                 string `json:"cid"`
	PID                 string `json:"pid"`
	SubCode             string `json:"ucode"`
	FirstLineIsNumTests bool   `json:"firstLineIsNumTests"`
	NumLinesPerTestCase int    `json:"numLinesPerTestCase"`
	NumLinesPerOutput   int    `json:"numLinesPerOutput"`
}
type FTestMaps []struct {
	Input        string `json:"in"`
	SystemOutput string `json:"sOut"`
	UserOutput   string `json:"uOut"`
}
var workNumber int =0
func main(){
	// already has submission link , problem id , contest id , TestCaseLine , numInputLine , numOutputLine
	e :=echo.New()
	e.POST("/start",workerServers)
	port := os.Getenv("PORT")
	if port == "" {
		port = ":5004"
	} else {
		port = ":" + port
	}
	err := e.Start(port)
		if err != nil {
		fmt.Println("error while starting server : ", err.Error())
		return
	}
}
func workerServers(c echo.Context)error{
	var workLink string
	if workNumber==0{
		workLink="https://atcoder-stress-test-v2.onrender.com/compile"
		workNumber=1
	}else{
		workLink="https://stress-test-v2-worker-2.onrender.com/compile"
		workNumber=0
	}
	b, _ := io.ReadAll(c.Request().Body)
	fmt.Println(workLink)

	fmt.Println(string(b))
	req,err := http.NewRequest("POST",workLink,bytes.NewBuffer(b))
	if err != nil{
		fmt.Println("error found ",err)
	}
	req.Header.Add("Content-Type","application/json")
	client :=&http.Client{}
	resp,err := client.Do(req)
	if err!=nil{
		fmt.Println("failed to make post request from apiGateway ",err)
	}
	defer resp.Body.Close()
	post := &FTestMaps{}
	derr := json.NewDecoder(resp.Body).Decode(post)
	if derr != nil {
		fmt.Println("error while decoding final results ",derr)
	}
	return c.JSON(http.StatusOK,post)
}
