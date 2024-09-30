# Stress-Test Your AtCoder Problems Online - v2

**Exciting News!**
Version 2 is now live! 🚀
*(Main branch contains the prototype)*

![atcoder](https://github.com/user-attachments/assets/9da39c7d-c528-4ffe-aaa9-2988ad1b00c4)


---

## 🔍 Overview

This microservice tool streamlines the debugging process for AtCoder problems by leveraging platform test cases and user inputs. It isolates each test case, dry-runs your code, retrieves the expected output, and compares it with editorial solutions. This iterative process helps quickly identify discrepancies, pinpoint failing test cases, and makes debugging much easier.

---

## 🛠️ Tech Stack

- **Backend:** Golang, REST API, Docker (WIP - for scaling requests)
- **Frontend:** Next.js, TailwindCSS, Bootstrap

---

## ⚙️ System Architecture

1. **Frontend**: User interface for submitting code and viewing results.
2. **Backend**: Composed of multiple services:
   - `api-gateway` (apiGate) - Routes requests.
   - `cs1 & cs2` - Worker servers responsible for handling compilation and test execution.
   - `subCode` - Web scraping server fetching test cases from AtCoder.

### **System Flow:**

```plaintext
Frontend ➡️ subCode (Web Scraping) ➡️ Frontend ➡️ apiGate (API Gateway) ➡️ cs1 & cs2 (Worker Servers) ➡️ apiGate ➡️ Frontend
```

---

## 💻 How to Use
The frontend is still under development, but you can manually test the backend API using `curl`:
```bash
curl -H 'Content-Type: application/json' -X POST http://localhost:5001/compile -d '{
  "cid": "ARC171",
  "pid": "A",
  "ucode": "#include<bits/stdc++.h>\nusing namespace std;\n#define int long long\nconst int maxn = 100010;\nint T,n,a,b;\nsigned main(){\n\tcin>>T;\n\twhile(T--){\n\t\tcin>>n>>a>>b;\n\t\tif(a>=n/2){\n\t\t\tputs(b>(n-a)*(n-a) ? \"No\" : \"Yes\");\n\t\t}else{\n\t\t\tint Sp=n-a*2;\n\t\t\tputs(b>a*(n-a)+(a+Sp)*((Sp+1)/2) ? \"No\" : \"Yes\");\n\t\t}\n\t}\n}',
  "firstLineIsNumTests": true,
  "numLinesPerTestCase": 1,
  "numLinesPerOutput": 1
}'
```

## Example API Response
```json
{
  "failingTestCases": [
    {
      "input": "testcase_input_here",
      "systemOutput": "expected_output_here",
      "userOutput": "user_output_here"
    }
  ]
}
```
The response provides JSON data, highlighting failing test cases by showing the input, system output, and the output produced by the user's code.


---
## 🚧 Current Limitations
1. **Command-Line Only**: Works via the command line interface (CLI) until the frontend is completed.
2. **Manual Contest Links**: Contest links must be manually added to our database due to web scraping issues, resulting in a short delay after each contest before test cases are added.
3. **Variable Line Support**: Does not support test cases with variable lines of input or output yet.

---
## 🎯 Future Targets

- Custom Test Cases: Add functionality for users to write custom test cases for faster debugging.
- AI-Powered Separation: Explore AI-powered tools to automate the separation of test cases, removing reliance on manual input.
- Previous Submissions: Implement features to track and manage users' previous submissions on AtCoder.

---
## 🤝 Contributions

We welcome all contributions! If you're interested in improving the tool, feel free to:

- Suggest improvements
- Report issues
- Help tackle existing limitations