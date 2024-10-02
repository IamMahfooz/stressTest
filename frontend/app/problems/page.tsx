"use client"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Define the TestCase interface
interface TestCase {
    in: string;
    sOut: string;
    uOut: string;
}

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
    // Update state to use TestCase type
    let [failingTestcases, setFailingTestcases] = useState<TestCase[]>([]);
    let [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);
    const searchParams = useSearchParams();
    const subUrl = searchParams.get('suburl');
    const [cid, setCid] = useState("");
    const [pid, setPid] = useState("");
    const [code, setCode] = useState("Please wait while we retrieve your submitted code...");
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
            <div className="w-4/5 mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-gray-800 dark:text-gray-200 mb-6 text-xl font-bold">
                    Your Submitted Code:
                </h2>
                <pre className="bg-gray-50 dark:bg-gray-900 dark:text-gray-200 p-4 rounded border border-gray-300 dark:border-gray-700 h-72 overflow-y-auto">
      {code}
    </pre>

                <p className="mt-6 mb-4 text-lg text-gray-800 dark:text-gray-300">
                    Please provide additional details to continue:
                </p>

                <table className="w-full border-spacing-2 mb-6">
                    <tbody>
                    <tr>
                        <td className="text-left font-semibold text-gray-700 dark:text-gray-200 p-2">
                            Is the first line of input the number of test cases?
                        </td>
                        <td>
                            <select
                                id="testcaseNumbers"
                                onChange={(e) => setTestCaseNumbers(e.target.value)}
                                className="p-2 rounded border border-gray-300 dark:border-gray-700 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                                <option value="YES">YES</option>
                                <option value="NO">NO</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left font-semibold text-gray-700 dark:text-gray-200 p-2">
                            How many lines are in each input test case?
                        </td>
                        <td>
                            <input
                                type="text"
                                name="inLine"
                                value={inLine}
                                onChange={(e) => setInLine(e.target.value)}
                                className="p-2 rounded border border-gray-300 dark:border-gray-700 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left font-semibold text-gray-700 dark:text-gray-200 p-2">
                            How many lines are in each output test case?
                        </td>
                        <td>
                            <input
                                type="text"
                                name="outLine"
                                value={outLine}
                                onChange={(e) => setOutLine(e.target.value)}
                                className="p-2 rounded border border-gray-300 dark:border-gray-700 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* Submit button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`p-3 rounded text-white font-semibold transition duration-300 ease-in-out ${
                            isLoading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {isLoading ? "Fetching..." : "Fetch Failing Test Cases"}
                    </button>
                </div>

                {/* Displaying failing test cases */}
                {failingTestcases.length > 0 && (
                    <div className="mt-10">
                        <h3 className="text-center text-gray-800 dark:text-gray-200">
                            Failing Test Case {currentTestCaseIndex + 1} / {failingTestcases.length}
                        </h3>
                        <pre className="bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded border border-red-400 dark:border-red-700 mt-4 overflow-auto">
          <strong>Input:</strong> {failingTestcases[currentTestCaseIndex].in}
                            <br />
          <strong>System Output:</strong> {failingTestcases[currentTestCaseIndex].sOut}
                            <br />
          <strong>Your Output:</strong> {failingTestcases[currentTestCaseIndex].uOut}
        </pre>
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrevious}
                                disabled={currentTestCaseIndex === 0}
                                className={`p-2 rounded text-white ${
                                    currentTestCaseIndex === 0
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentTestCaseIndex === failingTestcases.length - 1}
                                className={`p-2 rounded text-white ${
                                    currentTestCaseIndex === failingTestcases.length - 1
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                Next
                            </button>
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
            <Search/>
        </Suspense>
    );
}
async function fetchTestcases(cid: string, pid: string, code: string, inLine: number, outLine: number, testcaseNumbers: boolean) {
    try {
        if(cid!="ARC171" && pid!="A"){
            console.log("contest not added yet ! only ARC-171 A added for testing")
            alert("contest not added yet ! only ''ARC-171 A`` added for demo purpose")
            return "contest not added yet"
        }
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
