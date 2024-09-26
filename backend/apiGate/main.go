package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)
type Request struct {
	SubmissionLink      string `json:"submissionLink"`
	FirstLineIsNumTests bool   `json:"firstLineIsNumTests"`
	NumLinesPerTestCase int    `json:"numLinesPerTestCase"`
	NumLinesPerOutput   int    `json:"numLinesPerOutput"`
}
func main(){
	// already has submission link , problem id and contest number
	e :=echo.New()
	e.POST("/start",workerServers)
	e.Start(":5000")

}
func workerServers(c echo.Context)error{
	body :=c.Request().Body
	fmt.Println(body)
	resp,err := http.NewRequest("POST","http://locahhost:5001/compile",body)
	if err != nil{
		fmt.Println("error found ",err)
	}
	respBody := resp.Body
	defer resp.Body.Close()

	return c.JSON(http.StatusOK,respBody)
}