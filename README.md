Frontend for the assignment platform using React + Vite.


---

 Features

Login & Register

Teacher dashboard

Create assignments

View assignment list

View student submissions


Student dashboard

View assignments

Submit assignment


Full API integration

Clean purple-white UI

Uses axios + localStorage token



---

 Tech Stack

React

Vite

Axios

React Router

CSS (custom inline styling)



---

 Run Locally

npm install
npm run dev

Runs at:

http://localhost:5173


---
 API Connection

Edit src/lib/api.js if changing backend URL:

export default axios.create({
  baseURL: "http://localhost:5000",
});


---
