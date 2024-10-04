# FRONTEND
---
### 🛠️  Tech Stack : 
- next.js , TailwindCss , Bootstrap (shadcn/ui).

### ➡️ **Control Flow:**
1. User enters the submission link and hits enter.
2. Fronted queries the subCode server for `submitted code , contest-id and problem-id` . 
3. On the next page the submitted code is displayed , some more queries is asked to the users and all the queries (code , cid , pid , line queries) is sent to backend via Post request .
4. The backend process the request and return a json file containing failing testcaes with fields as `input , system output and user output`.
5. The final failing testcases are displayed , each testcase at a time.
```plaintext
HomePage ➡️ Servers ➡️ Maps Page 
```
### ✨ **Glimpses** :
![Input](https://github.com/user-attachments/assets/b0cefe67-bb73-473f-beab-db306bf2d8cb)  

![atcoder](https://github.com/user-attachments/assets/343f3124-4c63-45c3-937e-14c72d52147a)


