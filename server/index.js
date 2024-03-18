const cheerio = require('cheerio')
const express = require('express')
const app =express()

app.use(express.static("../fronted/build"))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../fronted/build", "index.html"));
})
app.get('/problem',(req, res)=>getSubmissionCode(req,res))
app.listen(5000);
const getSubmissionCode = async (req,res) => {
    console.log(req.query.param);
    // get html text from reddit
    const response = await fetch(req.query.param);
    // using await to ensure that the promise resolves
    const body = await response.text();
    const $=cheerio.load(body)
    const submittedCode=$("#submission-code").html();
    res.send(submittedCode);

};
// getSubmissionCode();