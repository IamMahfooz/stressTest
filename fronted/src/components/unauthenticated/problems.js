import {useLocation} from "react-router-dom";
import {useState} from "react";
export default function Problems(){
    const { state } = useLocation();
    let [submittedCode, setSubmittedCode] = useState(null);
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
                        <select name="testcasesNumbers">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>
                            <pre>How many lines area there in EACH INPUT testcase ? </pre>
                        </b>
                    </td>
                    <td><input/></td>
                </tr>
                <tr>
                    <td>
                        <b>
                            <pre>How many lines are there in EACH testcase OUTPUT ? </pre>
                        </b>
                    </td>
                    <td><input/></td>
                </tr>
                </tbody>
            </table>
            <button className="btn btn-samples">SEE FAILING TESTCASES</button>
        </div>
    )
}