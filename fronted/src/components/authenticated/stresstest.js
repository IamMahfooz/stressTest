
import { useNavigate } from "react-router-dom";
import { useState} from "react";

export default function Stresstest(){
    const [submissionLink, setSubmissionLink] = useState("");
    const [problemIndex, setProblemIndex] = useState("");
    const navigate =useNavigate();
    return (
        <div style={{width: 780 ,marginLeft:"auto" ,marginRight: "auto" }}>
        <h1 style={{textAlign: "center"}}>Stress Test your Atcoder Problems</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vestibulum eu arcu mollis feugiat. Nunc et massa vel nibh aliquam auctor at nec tortor. Suspendisse laoreet ante sit amet magna interdum tristique. Aliquam erat volutpat. Aliquam tincidunt quam nec turpis mattis, in accumsan purus placerat. Aenean efficitur congue metus, at elementum arcu. Vivamus non suscipit odio. Praesent egestas ligula urna, sit amet iaculis dolor luctus vel. Quisque rutrum justo pretium, viverra sem non, iaculis lectus. Nunc ultrices libero posuere, efficitur arcu eu, fermentum dolor. Aenean pellentesque velit ac augue malesuada imperdiet. Sed id dui sodales, mattis mi a, sagittis nisi. Aenean consectetur efficitur justo, sit amet eleifend sem sagittis ac. </p>
                <div className="table-responsive " style={{display: "flex" ,justifyContent: "center" }}>
                    <table className="test-table">
                        <tbody>
                        <tr>
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
                        <tr>
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
            <button className="btn btn-samples" type="submit" name="submit" value="samples" onClick={()=>callNext({submissionLink,problemIndex,navigate})}>Stress Test</button>
        </div>
)
}
function callNext({submissionLink,problemIndex,navigate}) {
    navigate("/problems", { state: { submissionLink, problemIndex } });
}