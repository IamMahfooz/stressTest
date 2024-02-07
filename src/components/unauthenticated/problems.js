import {useLocation} from "react-router-dom";
export default function Problems(){
    const { state } = useLocation();
    console.log(state.submissionLink)
    let submittedCode
    (async () => {
        const mainUrl = "http://localhost:5000/problem";
        const urlToInclude = state.submissionLink;
        const encodedUrl = encodeURIComponent(urlToInclude);
        const finalUrl = mainUrl + "?param=" + encodedUrl;
        console.log(finalUrl);
        const response = await fetch(finalUrl)
        console.log(response.status)
        switch (response.status) {
            // status "OK"
            case 200:
                submittedCode= await response.body;
                // console.log(submittedCode);
                break;
            // status "Not Found"
            case 404:
                console.log('Invalid submission link');
                break
            default :

        }
    })();
    return (
        <div>
            <p>Your submitted code is : {submittedCode}</p>
        </div>
    )
}