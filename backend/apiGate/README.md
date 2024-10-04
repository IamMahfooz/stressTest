# API Gateway
---
### 🛠️  Tech Stack :
- Golang
- Api Integration
- load balancing

### ➡️ **Control Flow:**
1. It receives request from frontend .
2. Based on load on the servers it assigns the request to server having lesser load [WIP].
3. It then acts as a proxy server and transfers the response from the worker servers to the frontend.
```plaintext
SubCode ➡️ Frontend ➡️ Api Gateway ➡️ Worker Servers ➡️ Api Gateway ➡️ Frontend
```
### 🎯 **[WIP] & Future Works** :
1. Add load balancing feature to handle concurrent requests seamlessly.
2. Write unit test for each function.
3. Add docker support.
