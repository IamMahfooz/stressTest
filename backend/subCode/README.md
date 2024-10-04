# Submission Info
---
### 🛠️  Tech Stack :
- Node.js
- web scrapping

### ➡️ **Control Flow:**
1. It receives request from frontend.
2. It scraps the html from atcoder and extact the submitted code , contest id and problem id.
3. After processing it sends back the response to the frontend.
```plaintext
Frontend ➡️ SubCode ➡️ Frontend ➡️ Api Gateway ➡️ Worker Servers ➡️ Api Gateway ➡️ Frontend
```
### 🎯 **[WIP] & Future Works** :
2. Write unit tests.
3. Add docker support.
