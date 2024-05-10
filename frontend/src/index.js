import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import reportWebVitals from './reportWebVitals';
import Router from "./routes";
import Navbar from "./components/navbar";
import Footer from "./components/footer";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      {/*<RouterProvider router={router}/>*/}
      <Navbar />
      <Router />
      <Footer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
