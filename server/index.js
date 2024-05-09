const cheerio = require('cheerio')
const express = require('express')
const app =express()
const cors = require('cors');
const fs = require('node:fs');
const execSync = require('child_process').execSync;
const _ = require('lodash');
const {join} = require("path");

app.use(cors())
app.use(express.json())
app.use(express.static("../frontend/build"))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, "../frontend/build", "index.html"));
})
app.get('/problem',(req, res)=>getSubmissionCode(req,res));
app.post('/getMaps',(req,res)=>getFailingCases(req,res));
app.listen(5000);

const getSubmissionCode = async (req,res) => {
    try {
        console.log(req.query.param);
        // get html text from reddit
        const response = await fetch(req.query.param);
        // using await to ensure that the promise resolves
        const body = await response.text();
        const $=cheerio.load(body);
        const submittedCode= _.unescape($("#submission-code").html());
        // console.log(submittedCode)
        // writeCodeToFile(submittedCode);
        // compileBinary();
        res.send(submittedCode);
    }catch (error){
        console.log(error)
    }

};
const getFailingCases = (req,res)=>{
    let jsonData = req.body
    // console.log(jsonData.outLine);
    jsonData=jsonData.inLine;
    const data ={
        message: "received",
        alert: "post successfully"
    }
    res.send(JSON.stringify(data));
    executeDiffs(jsonData);
}
function executeDiffs(submissionData){
    const testcaseBool = submissionData.testCaseNumbers;
    const inLine = submissionData.inLine;
    const outLine = submissionData.outLine;
    const contestNumber = submissionData.contestNumber.toUpperCase();
    const problemIndex = submissionData.problemIndex.toUpperCase();
    const folderPath = "../../../atcoder_testcases/"+contestNumber+"/"+problemIndex;
    const submittedCode =submissionData.submittedCode;
    const files=fs.readdirSync(folderPath+"/in/");

    writeCodeToFile(submittedCode);
    compileBinary();

    let userOutput = ""
    let sysOutput = ""

    for(let i=0;i<files.length;i++){
        // console.log(`${i} file was ${files[i]}`);
        execSync(`cat ${folderPath}"/in/"${files[i]} | ./a.out  > out.txt`)
        const filePath = __dirname+`/out.txt`
        userOutput[i]=fs.readFileSync(filePath,
            {encoding: 'utf8', flag: 'r'});
        sysOutput[i]=fs.readFileSync(folderPath+"/out/"+files[i],
            {encoding: 'utf8', flag: 'r'});
        // console.log(`the data of ${i} is ${data}`)
        console.log(`completed file number ${i}`);
    }
    console.log(userOutput[0]);
    console.log(sysOutput[0]);
    // console.log(testcaseBool)
    // console.log(inLine);
    // console.log(outLine);
}
function writeCodeToFile(submittedCode){
    try {
        fs.writeFileSync('Output.cpp', submittedCode)
        //file written successfully
    } catch (err) {
        console.error(err)
    }
}
function compileBinary(){
    try {
        const cmd = 'g++ Output.cpp ';
        execSync(cmd).toString();
    } catch (error) {
        console.log(`Status Code: ${error.status} with '${error.message}'`);
    }


}