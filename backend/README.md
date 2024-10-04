# Backend
---
### 🛠️  Tech Stack :
- Api Gateway : Golang
- worker servers : Golang
- Sub Code : Node.js

### ➡️ **Control Flow:**
1. **SubCode**: Responsible for user code , contest id and problme id extraction from atcoder using web scrapping.
2. **API Gateway**: Responsible for load balancing between the two worker servers.
3. **Worker Servers** : Responsible for testcases folder fetching from dopbox , compiling submitted code, running the code against testcase files and separating each failing testcaes.
```plaintext
SubCode ➡️ Frontend ➡️ Api Gateway ➡️ Worker Servers ➡️ Api Gateway ➡️ Frontend
```
### ✨ **Glimpses** :
- Worker Servers :
![image](https://github.com/user-attachments/assets/c43d04c3-283c-49ef-adf9-7b24d7ed166c)
- Sub Code :
![image](https://github.com/user-attachments/assets/c4d0025e-8408-4e7d-8e82-f54c4c006926)


