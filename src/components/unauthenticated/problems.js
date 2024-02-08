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
        <div>
            <pre>Your submitted code is :<br></br> {submittedCode}</pre>
        </div>
    )
}