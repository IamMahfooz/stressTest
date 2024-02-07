const express =require('express')
const {response} = require("express");
const axios = require('axios');
const fs = require('fs').promises;

const app = express();
const port =5000
app.use(express.static("../build"))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
})
app.get('/problem', function(req, res) {
    const paramValue = req.query.param;
    let submittedCode
    console.log('Received parameter:', paramValue);
    // const response = fetch(paramValue).then()
    let template

    submittedCode = template.getElementById('for_copy0').innerText;
    console.log(submittedCode);
    res.send(submittedCode);


});
app.listen(5000);
