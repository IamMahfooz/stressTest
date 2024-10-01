package utils

import (
	"fmt"
	"os"
)

func removeTestcaseDir(uIdentify string) error {
	err := os.RemoveAll("./testcases_" + uIdentify)
	if err != nil {
		fmt.Println("error while removing testcase directory : ", err)
		return err
	}
	return nil
}

func removeZipFolder(uIdentify string) error {
	err := os.RemoveAll("./" + uIdentify + ".zip")
	if err != nil {
		fmt.Println("error while deleting the zip folder : ", err)
		return err
	}
	return nil
}

func removeSubmittedCode(uIdentify string) error {
	err := os.Remove("./submission" + uIdentify + ".cpp")
	if err != nil {
		fmt.Println("error while removing submitted code : ", err)
		return err
	}
	return nil
}

func removeCompiledBinary(uIdentify string) error {
	err := os.Remove("./compiled_binary" + uIdentify)
	if err != nil {
		fmt.Println("error while removing compiled binary : ", err)
		return err
	}
	return nil
}
func FullWipeOut(uIdentify string) {
	_ = removeSubmittedCode(uIdentify)
	_ = removeCompiledBinary(uIdentify)
	_ = removeTestcaseDir(uIdentify)
	_ = removeZipFolder(uIdentify)
	return
}
