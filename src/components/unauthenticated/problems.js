import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
export default function Problems(){
    const { state } = useLocation();
    const [submittedCode, setSubmittedCode] = useState(null);
    async function fetchData() {
        try {
            const mainUrl = 'http://localhost:5000/problem';
            const urlToInclude = state.submissionLink;
            const encodedUrl = encodeURIComponent(urlToInclude);
            const finalUrl = `${mainUrl}?param=${encodedUrl}`;

            const response = await fetch(finalUrl);

            console.log('response status is ', response.status);
            switch (response.status) {
                case 200:
                    console.log('success');
                    const codeText = response.text();
                    codeText.then((text)=>setSubmittedCode(text))
                    return
                default:
            }
        }catch (error){
            console.log(error)
        }
    }
    fetchData().then(()=>console.log("the submitted code is",submittedCode));

    return (
        <div style={{width: 780, marginLeft: "auto", marginRight: "auto"}}>
            <h1 style={{textAlign: "center"}}>Just Some some more queries :</h1><br/>
            Do first line of input file is number of testcase ? :: <textarea >0/1</textarea><br/>
            How many lines area there in each testcase ? :: <textarea>?</textarea><br/>
            How many lines are there in each testcase output ? :: <textarea>?</textarea><br/><br/>
            Your submitted Code was :<br/>
            <pre style={{backgroundColor: "white"}}>{submittedCode}</pre><br/>
            The failing testcase and and output are  ? :: <textarea>*****</textarea><br/><br/>


        </div>
    )
}