import Problems from "../unauthenticated/problems";

export default function Stresstest(){
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
                            <td><input className="form-control" type="text" name="submission_link" value="https://atcoder.jp/contests/arc166/****"/></td>
                        </tr>
                        <tr>
                            <td><b>Problem Index</b></td>
                            <td><input className="form-control" type="text" name="problem_index" value="c"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {/*<input className="btn btn-sucess" type="submit" value="Stress Test" target="._blank" />*/}
                <button className="btn btn-samples" type="submit" name="submit" value="samples" onClick={Problems()}>Stress Test</button>
        </div>
)
}