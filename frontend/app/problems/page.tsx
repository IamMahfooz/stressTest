"use client"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Schema for form validation
const formSchema = z.object({
    problemId: z.string().min(1, {
        message: "Problem ID must be at least 1 character.",
    }),
});

function Search() {
    let [inLine, setInLine] = useState("");
    let [outLine, setOutLine] = useState("");
    let [testCaseNumbers, setTestCaseNumbers] = useState("YES");
    let [failingTestcases, setFailingTestcases] = useState([]);
    let [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);
    const searchParams = useSearchParams();
    const subUrl = searchParams.get('suburl');
    const [cid, setCid] = useState("");
    const [pid, setPid] = useState("");
    const [code, setCode] = useState("Please wait while we retrieve your submitted code... ETA - 3 mins");
    const [isLoading, setIsLoading] = useState(false); // New loading state

    // Fetch submitted code
    useEffect(() => {
        fetch("https://stress-test-v2-subcode.onrender.com/getsubinfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: subUrl }),
        }).then((response) => {
            response.json().then((data) => {
                if (data.ucode == null) {
                    setCode("<p>Unable to fetch your submitted solution. Contact Administrator!</p>");
                } else {
                    setCid(data.cid.toUpperCase());
                    setPid(data.pid.toUpperCase());
                    console.log(data.cid.toUpperCase(), data.pid.toUpperCase());
                    setCode(data.ucode);
                }
            });
        });
    }, [subUrl]);

    // Handle submit to fetch failing test cases
    const handleSubmit = async () => {
        setIsLoading(true); // Set loading state to true
        const testcaseData = await fetchTestcases(
            cid,
            pid,
            code,
            parseInt(inLine),
            parseInt(outLine),
            testCaseNumbers === "YES"
        );

        if (testcaseData) {
            setFailingTestcases(testcaseData);
            setCurrentTestCaseIndex(0); // Reset to the first test case
        }
        setIsLoading(false); // Set loading state back to false
    };

    // Navigation buttons
    const handleNext = () => {
        if (currentTestCaseIndex < failingTestcases.length - 1) {
            setCurrentTestCaseIndex(currentTestCaseIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentTestCaseIndex > 0) {
            setCurrentTestCaseIndex(currentTestCaseIndex - 1);
        }
    };

    return (
        <>
            <title>AST - Failing Maps</title>
            <div style={{
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
                    Your Submitted Code:
                </h2>
                <pre style={{
                    backgroundColor: "#fafafa",
                    padding: "15px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    height: "300px",
                    overflowY: "auto"
                }}>
                    {code}
                </pre>

                <p style={{ marginTop: "20px", marginBottom: "20px", fontSize: "16px" }}>
                    Please provide additional details to continue:
                </p>

                <table style={{
                    width: "100%",
                    borderSpacing: "10px",
                    marginBottom: "20px"
                }}>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: "left", fontWeight: "bold", padding: "10px" }}>
                            Is the first line of input the number of test cases?
                        </td>
                        <td>
                            <select id="testcaseNumbers" onChange={(e) => setTestCaseNumbers(e.target.value)} style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                width: "100%",
                                fontSize: "14px"
                            }}>
                                <option value="YES">YES</option>
                                <option value="NO">NO</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "left", fontWeight: "bold", padding: "10px" }}>
                            How many lines are in each input test case?
                        </td>
                        <td>
                            <input
                                type="text"
                                name="inLine"
                                value={inLine}
                                onChange={(e) => setInLine(e.target.value)}
                                style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                    width: "100%",
                                    fontSize: "14px"
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "left", fontWeight: "bold", padding: "10px" }}>
                            How many lines are in each output test case?
                        </td>
                        <td>
                            <input
                                type="text"
                                name="outLine"
                                value={outLine}
                                onChange={(e) => setOutLine(e.target.value)}
                                style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                    width: "100%",
                                    fontSize: "14px"
                                }}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* Submit button to fetch test cases */}
                <div style={{ textAlign: "center" }}>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading} // Disable button while loading
                        style={{
                            padding: "10px 20px",
                            backgroundColor: isLoading ? "#ccc" : "#28a745", // Change color when loading
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontSize: "16px"
                        }}
                    >
                        {isLoading ? "Fetching... ETA : 3 mins" : "Fetch Failing Test Cases"}
                    </Button>
                </div>

                {/* Displaying the failing test cases */}
                {failingTestcases.length > 0 && (
                    <div style={{ marginTop: "30px" }}>
                        <h3 style={{ textAlign: "center" }}>Failing Test Case {currentTestCaseIndex + 1} / {failingTestcases.length}</h3>
                        <pre style={{
                            backgroundColor: "#fff3f3",
                            padding: "15px",
                            borderRadius: "5px",
                            border: "1px solid #f8d7da",
                            overflow: "auto"
                        }}>
              <strong>Input:</strong> {failingTestcases[currentTestCaseIndex].in}
                            <br />
              <strong>System Output:</strong> {failingTestcases[currentTestCaseIndex].sOut}
                            <br />
              <strong>Your Output:</strong> {failingTestcases[currentTestCaseIndex].uOut}
            </pre>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <Button onClick={handlePrevious} disabled={currentTestCaseIndex === 0}>
                                Previous
                            </Button>
                            <Button onClick={handleNext} disabled={currentTestCaseIndex === failingTestcases.length - 1}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default function SubmissionForm() {
    return (
        <Suspense fallback={<>Loading...</>}>
            <Search />
        </Suspense>
    );
}

async function fetchTestcases(
    cid: string,
    pid: string,
    code: string,
    inLine: number,
    outLine: number,
    testcaseNumbers: boolean
) {
    try {
        // Log the request body to see if the cid and pid are being passed correctly
        console.log("Request body:", {
            cid: cid,
            pid: pid,
            ucode: code,
            firstLineIsNumTests: testcaseNumbers,
            numLinesPerTestCase: inLine,
            numLinesPerOutput: outLine
        });

        const response = await fetch("https://stress-test-v2-api-gateway.onrender.com/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cid: cid,
                pid: pid,
                ucode: code,
                firstLineIsNumTests: testcaseNumbers,
                numLinesPerTestCase: inLine,
                numLinesPerOutput: outLine
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch test cases");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching test cases:", error);
    }
}
