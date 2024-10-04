# Worker Servers
---
### 🛠️  Tech Stack :
- Golang
- Api Integration
- ioutils

### ➡️ **Control Flow:**
1. It receives request from the api gateway.
2. Perform tasks - .cpp creatiion from text , binary creation , compiling and runnig with input files and segregating failing testcaes.
3. After finding the failing testcases it sends back the json to the api gateway.
```plaintext
SubCode ➡️ Frontend ➡️ Api Gateway ➡️ Worker Servers ➡️ Api Gateway ➡️ Frontend
```
### 🎯 **[WIP] & Future Works** :
1. Add support for dynamic testcases folder download ( for now , link is being harcoded for eah contest).
2. Write unit test for each function.
3. Add docker support.
