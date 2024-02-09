const exec = require('child_process').exec;
const puppeteer = require('puppeteer');
const express =require('express')
const fs = require('fs').promises;

const app = express();
const port =5000
app.use(express.static("../build"))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
})
app.get('/problem', (req, res)=> {
    const paramValue = req.query.param;
    let submittedCode
    console.log('Received parameter:', paramValue);
    async function fetchData() {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(paramValue);
            await page.waitForSelector('#for_copy0');
            submittedCode = await page.$eval('#for_copy0', element => element.textContent.trim());
            await browser.close();

        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    fetchData().then(()=>{
        fs.writeFile('Output.cpp', submittedCode, (err) => {
            if (err) throw err;
        }).then(()=>{
            exec('g++ Output.cpp && cat in.txt | ./a.out  >out.txt' ,
                function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        })
        res.send(submittedCode)});
});
app.listen(5000);
