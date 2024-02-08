// const jsdom = require('jsdom');
// const {JSDOM} = jsdom;
//
// class DOMParser {
//     parseFromString(s, contentType = 'text/html') {
//         return new JSDOM(s, {contentType}).window.document;
//     }
// }
// const axios = require('axios');
// const cheerio = require('cheerio');

const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const puppeteer = require('puppeteer');

const express =require('express')
const {response} = require("express");
// const axios = require('axios');
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
    // // const response = fetch(paramValue).then((response)=>return response.text())
    // let temp
    // function displayFileContentsPromise() {
    //     fetch(paramValue)
    //         .then(response => response.text())
    //         .then((text) =>{
    //             // console.log(text)
    //             temp=text})
    //         .catch(error => console.error(error));
    // }
    // displayFileContentsPromise()
    // const parser = new DOMParser();
    // const document = parser.parseFromString(temp, "text/html");
    // console.log(typeof document)
    //
    // submittedCode = document.getElementById('for_copy0').innerHTML;
    // console.log(submittedCode);
    // res.send(submittedCode);
    async function fetchData() {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(paramValue);

            // Wait for the target element to be available
            await page.waitForSelector('#for_copy0');

            // Get the text content of the element
            submittedCode = await page.$eval('#for_copy0', element => element.textContent.trim());

            // console.log('Copied data:', copiedData);

            await browser.close();

        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    // print to  file
    fetchData().then(()=>{
        fs.writeFile('Output.cpp', submittedCode, (err) => {

            // In case of a error throw err.
            if (err) throw err;
        }).then()
        res.send(submittedCode)});
});
app.listen(5000);
