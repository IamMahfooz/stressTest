# Stress-Test Your Atcoder Problems Online - v2

**Exciting News!**
Version 2 is now live! 🚀
(Main branch contains the prototype)
![atcoder](https://github.com/user-attachments/assets/343f3124-4c63-45c3-937e-14c72d52147a)
---

## 🔍 Overview

This microservice tool streamlines the debugging process for AtCoder problems by leveraging platform test cases and user inputs. It isolates each test case, dry-runs your code, retrieves the expected output, and compares it with editorial solutions. This iterative process helps quickly identify discrepancies, pinpoint failing test cases, and makes debugging much easier.

---

## 🛠️ Tech Stack

- **Backend:** Golang, Node.js, REST API, Docker (WIP - for scaling requests)  
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
Just enter the submission link and you are good to GO !
![Input](https://github.com/user-attachments/assets/b0cefe67-bb73-473f-beab-db306bf2d8cb)

---
## 🚧 Current Limitations
1. **Delay in Response time**: Since the api gateway , worker-servers and code scrapping servers are hosted in Render's free service , so the services generally spins down due to inactivity and takes around 1-2 minutes to spin back again.
1. **Manual Contest Links**: Contest links must be manually added to our database due to web scraping issues, resulting in a short delay after each contest before test cases are added.
2. **Variable Line Support**: Does not support test cases with variable lines of input or output yet.

---
## 🎯 Future Targets

- **Custom Test Cases**: Add functionality for users to write custom test cases for faster debugging.
- **AI-Powered Separation**: Explore AI-powered tools to automate the separation of test cases, removing reliance on manual input.
- **Previous Submissions**: Implement features to track and manage users' previous submissions on AtCoder.

---
## 🤝 Contributions
We welcome all contributions! If you're interested in improving the tool, feel free to:
- Suggest improvements
- Report issues
- Help tackle existing limitations

