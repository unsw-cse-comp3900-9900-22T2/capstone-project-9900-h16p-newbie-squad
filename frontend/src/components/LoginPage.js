import React from 'react'
import {Link, useNavigate } from "react-router-dom";
import Header from './Header'
import './login&signup.css'


export default function LoginPage() {
    const navigate = useNavigate()
    const Login = () => {
        var username = document.getElementById('User_name').value
        var password = document.getElementById('password').value
        const data = {
            username: username,
            password: password,
          }
        const headers = new Headers({
            'Content-Type': 'application/json',
            });
            fetch('http://localhost:5000/login',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers,
            })
            .then(res => res.json())
            .catch(error => {
                console.error('Error:', error)
            })
            .then(response => {
                if(response.error !== undefined)
                {
                    alert(response.error)
                    console.log(response.error)
                }
                else 
                {
                    var token=response.token
                    navigate('/',{state:{token:response.token,username:username},replace:true})
                }
            })
    }
    //document.getElementById('email_addr').style.top = '0px'
    return (
    <div>
        <Header/>
        <div className='information-box'>
            <div className='container-noborder'>
                <div className='login_page'>
                    <div>
                        <div>User name</div>
                        <input className="inputBlock" type="text" id="User_name"/>
                    </div>
                    <div>
                        <div>Password</div>
                        <input className="inputBlock" type="text" id="password"/>
                    </div>
                    <button onClick={() => Login()}>Login</button>
                    <div>Do not have an account?</div>
                    <Link to="/SignUp-Page"> <button >Sign up</button></Link>
                </div>
            </div>
        </div>
    </div>
  )
}