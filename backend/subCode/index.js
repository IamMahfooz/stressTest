// server for webscrapping

// Example to use : curl -X POST
// "http://localhost:5002/getsubinfo?param=https://atcoder.jp/contests/arc171/submissions/50079569"

const express = require('express');
const app = express();
var cors = require('cors')
const cheerio = require('cheerio');
const _ = require('lodash');

app.use(cors());
app.use(express.json());

app.post('/getsubinfo',(req,res)=>getSubInfo(req,res));
console.log(" starting the server at port : 5002")
app.listen(5002);

const getSubInfo = async(req,res)=>{
    try{
        const url = req.query.param;
        console.log(url)
        const response =await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        const submittedCode = _.unescape($("#submission-code").html());

        const match = url.match(/\/contests\/([^/]+)\//);
        contestNumber = match[1];
        const taskLinkSelector = `a[href*="/tasks/${contestNumber}_"]`;
        const taskLink = $(taskLinkSelector).attr('href');
        const problemId = taskLink.split('_').pop();
        res.json({
            cid: contestNumber,
            pid: problemId,
            ucode: submittedCode
        });

    }catch(error){
        console.log("error while handling request : ", error)
    }
}
