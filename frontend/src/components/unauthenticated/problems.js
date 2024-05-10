import {useLocation} from "react-router-dom";
import {useState} from "react";
export default function Problems(){
    const { state } = useLocation();
    let problemIndex =state.problemIndex;
    let contestNumber
    let [testCaseNumbers,setTestCaseNumbers]=useState("YES")
    let [submittedCode, setSubmittedCode] = useState(null);
    let [inLine,setInLine]=useState("");
    let [outLine,setOutLine]=useState("");
    async function fetchData() {
        try {
            const mainUrl = 'http://localhost:5000/problem';
            const urlToInclude = state.submissionLink;
            const match = urlToInclude.match(/\/contests\/([^/]+)\//);
            contestNumber=match[1];
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
        <div style={{width: 780 , marginLeft:"auto" , marginRight: "auto" }}>
            <b> <pre>Your submitted Code was :</pre></b>
            <pre style={{backgroundColor: "white" , overflowX:"scroll" ,overflowY:"scroll" ,height:"400px"}}>{submittedCode}</pre>
            <p>Just Some More Queries : - _ -</p>
            <table className="test-table">
                <tbody>
                <tr>
                    <td>
                        <b>
                            <pre>First Line of Input = No. of testCases ? </pre>
                        </b>
                    </td>
                    <td>
                        <select id="testcasesNumbers" onChange={(e)=>setTestCaseNumbers(e.target.value)}>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>
                            <pre>How many lines area there in EACH INPUT testcase ? </pre>
                        </b>
                    </td>
                    <td><input
                        type="text"
                        name="inLine"
                        value={inLine}
                        onChange={(e) => setInLine(e.target.value)}
                    /></td>
                </tr>
                <tr>
                    <td>
                        <b>
                            <pre>How many lines are there in EACH testcase OUTPUT ? </pre>
                        </b>
                    </td>
                    <td><input
                        type="text"
                        name="outLine"
                        value={outLine}
                        onChange={(e) => setOutLine(e.target.value)}
                    /></td>
                </tr>
                </tbody>
            </table>
            <button className="btn btn-samples" onClick={()=>getFailingMaps({inLine,outLine,contestNumber,problemIndex,submittedCode,testCaseNumbers})}>SEE FAILING TESTCASES</button>
        </div>
    )
}
function getFailingMaps(inLine,outLine,contestNumber,problemIndex,submittedCode,testCaseNumbers){
    const data={
        "contestNumber": contestNumber,
        "problemIndex": problemIndex,
        "submittedCode": submittedCode,
        "testCaseNumbers": testCaseNumbers,
        "inLine": inLine,
        "outLine": outLine
    }
    let outData
    fetch("http://localhost:5000/getMaps", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((data) =>{
            outData=data;
            console.log(outData)
        })
        .catch((error) => console.error("Error:", error));
}