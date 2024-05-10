
import { useNavigate } from "react-router-dom";
import { useState} from "react";

export default function Stresstest(){
    const [submissionLink, setSubmissionLink] = useState("");
    const [problemIndex, setProblemIndex] = useState("");
    const navigate =useNavigate();
    return (
        <div style={{width: 1000 ,marginLeft:"auto" ,marginRight: "auto" ,backgroundColor:"Background",height:"auto",}}>
        <h1 style={{textAlign: "center" ,color: "red"}}>Stress Test your Atcoder Problems</h1>
            <p><h2> Have you ever stuck on a Problem for hours ?</h2><br/>
                Well for Beginners-Intermediate it's a common thing :) ,But even the expert face it sometimes !<br/><br/>
                To overcome this obstacle it's always good to take some genuine hints that help you think in a proper direction . <br/><br/>
                Now what if someone gave you the failing test-case for your current submission , isn't that great to correct your path to
                think in the right approach and SAVE your TIME ?<br/><br/>
                If you wished the miracle to be true !! YEAH we won't upset you then :) <br/><br/>
                <center>Just Enter some queries and you are good to GO .</center>
            </p>
                <div className="table-responsive " style={{display: "flex" ,justifyContent: "center" }}>
                    <table className="test-table">
                        <tbody>
                        <tr >
                            <td>
                                <b>Submission Link</b>
                            </td>
                            <td><input
                                className="form-control"
                                type="text"
                                name="submission_link"
                                value={submissionLink}
                                onChange={(e) => setSubmissionLink(e.target.value)}
                            /></td>
                        </tr>
                        <tr >
                            <td><b>Problem Index</b></td>
                            <td><input
                                className="form-control"
                                type="text"
                                name="problem_index"
                                value={problemIndex}
                                onChange={(e) => setProblemIndex(e.target.value)}
                            /></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            <button style={{marginTop:"10px"}} className="btn btn-samples" type="submit" name="submit" value="samples" onClick={()=>callNext({submissionLink,problemIndex,navigate})}><b>Stress Test</b></button>
        </div>
)
}
function callNext({submissionLink,problemIndex,navigate}) {
    navigate("/problems", { state: { submissionLink, problemIndex } });
}