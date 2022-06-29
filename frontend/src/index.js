import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import PersonalInfo from './components/PersonalInfo';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="personal-info" element={<PersonalInfo />} />
      <Route path="login-page" element={<LoginPage />} />
      <Route path="SignUp-page" element={<SignUpPage />} />
      {/* </Route> */}
    </Routes>
    
  </BrowserRouter>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
