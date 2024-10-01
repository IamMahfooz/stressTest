package utils

import (
	"archive/zip"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
)

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
	unzippedFolderPath, err := unzipFolder(testCaseFolder, uIdentify)
	if err != nil {
		fmt.Println("error while unzipping zip file ; error :: ", err.Error())
	}
	err = removeZipFolder(strconv.Itoa(uIdentify))
	if err != nil {
		return "", err
	}
	return unzippedFolderPath, nil
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
		fmt.Println("error while downloading the zip folder : ", err)
		return err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
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
func unzipFolder(folderPath string, uIdentify int) (string, error) {
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
			fmt.Printf("impossible to create uncompressed: %s\n", err)
			return "", err
		}
		_, err = io.Copy(uncompressedFile, rc)
		if err != nil {
			fmt.Printf("impossible to copy file n°%d: %s\n", k, err)
			return "", err
		}
	}
	return "./testcases_" + strconv.Itoa(uIdentify), nil
}
