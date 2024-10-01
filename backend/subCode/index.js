// server for webscrapping

// Example to use :
// curl - H 'Content-Type: application/json' -
//     X POST http:  // localhost:5002/getsubinfo -d '{"url":
//                   // "https://atcoder.jp/contests/arc171/submissions/50079569"}'


const express = require('express');
const app = express();
//var cors = require('cors')
const cheerio = require('cheerio');
const _ = require('lodash');


var corsMiddleware = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    next();
}

app.use(corsMiddleware);


//app.use(cors());
app.use(express.json());

app.post('/getsubinfo',(req,res)=>getSubInfo(req,res));
app.get('/ping',(req,res)=>{res.json({status: 200})})
const port = process.env.PORT || 5002
console.log(" starting the server at port :", port)
app.listen(port);

const getSubInfo = async(req,res)=>{
    try{
        const url = req.body.url;
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
        // console.log("succes \n",submittedCode)

    }catch(error){
        console.log("error while handling request : ", error)
    }
}
