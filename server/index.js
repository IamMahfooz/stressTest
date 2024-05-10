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

        res.send(submittedCode);
    }catch (error){
        console.log(error)
    }

};
const getFailingCases = (req,res)=>{
    let jsonData = req.body
    jsonData=jsonData.inLine;
    const data ={
        message: "received",
        alert: "post successfully"
    }
    // res.send(JSON.stringify(data));
    const failingMap = executeDiffs(jsonData);
    res.send(JSON.stringify(failingMap))
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

    let testCases = []

    for(let i=0;i<files.length;i++){
        execSync(`cat ${folderPath}/in/${files[i]} | ./a.out  > out.txt`)
        const input = fs.readFileSync(folderPath+"/in/"+files[i],{encoding: 'utf8', flag: 'r'});
        const filePath = __dirname+`/out.txt`
        const userOutput=fs.readFileSync(filePath,
            {encoding: 'utf8', flag: 'r'});
        const sysOutput=fs.readFileSync(folderPath+"/out/"+files[i],
            {encoding: 'utf8', flag: 'r'});

        if(testcaseBool==="NO"){
            const testCase = {
                input: input,
                userOutput: userOutput,
                sysOutput: sysOutput
            };
            if(userOutput!==sysOutput){
                testCases.push(testCase);
            }
        }else{
            const inputLines=input.split('\n').filter(line => line.trim() !== '');
            inputLines.slice(1)
            const userOutputLines = userOutput.split('\n').filter(line => line.trim() !== '');
            const sysOutputLines = sysOutput.split('\n').filter(line => line.trim() !== '');
            const numberOfTestcases = inputLines.length/inLine;
            for(let i=0;i<numberOfTestcases;i++){
                for(let j=0,k=0;j<inputLines.length,k<sysOutputLines.length;j+=inLine,k+=outLine){
                    const testCase ={
                        input : inputLines.slice(j,j+inLine),
                        userOutput : userOutputLines.slice(k,k+outLine),
                        sysOutput : sysOutputLines.slice(k,k+outLine)
                    }
                    if(!(_.isEqual(testCase.userOutput,testCase.sysOutput))){
                        testCases.push(testCase);
                    }
                }
            }
        }
        console.log(`completed file number ${i}`);
        // if(i===1){
        //     break;
        // }
    }
    // console.log(testCases);
    return testCases;
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