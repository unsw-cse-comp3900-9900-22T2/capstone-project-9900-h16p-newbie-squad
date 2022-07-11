import React from 'react'
import {Link, useNavigate } from "react-router-dom";
import Header from './Header'
import './login&signup.css'

export default function LoginPage() {
    const navigate = useNavigate()
    const SignUp = () => {
        const username = document.getElementById('user_name').value
        const emailaddr = document.getElementById('email_addr').value
        const password1 = document.getElementById('password').value
        const password2 = document.getElementById('password2').value
        console.log(emailaddr.substr(emailaddr.length-4))
        if(username==''||emailaddr==''||password1==''||password2=='')
        {
            alert('You must fill each input box to sign up')
            return
        }
        if(emailaddr.length<7)
        {
            alert('Invalid email address(TOO short, at least 7 characters)')
            return
        }
        if(emailaddr.indexOf('@')==-1)
        {
            alert('Invalid email address(must contain \'@\')')
            return
        }
        if(emailaddr.substr(emailaddr.length-4)!=='.com')
        {
            alert('Invalid email address(invalid email-domain)')
            return
        }
        if(emailaddr.substr(emailaddr.length-5)=='@')
        {
            alert('Invalid email address(invalid email-domain)')
            return
        }
        if(password1 !== password2)
        {
            alert('Two passwords should be the same')
            return
        }
        const data = {
            username: username,
            email: emailaddr,
            password: password1,
        }
        const headers = new Headers({
            'Content-Type': 'application/json',
            });
            fetch('http://localhost:5000/register',
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
                    console.log(response.error)
                else 
                {
                    navigate('/',{state:{token:response.token,username:username},replace:true})
                }
            })
    }
    return (
    <div>
        <Header/>
        <div className='information-box'>
            <div className='container-noborder'>
                <div className='login_page'>
                    <div>
                        <div>User name</div>
                        <input className="inputBlock" type="text" id="user_name"/>
                    </div>
                    <div>
                        <div>Email address</div>
                        <input className="inputBlock" type="text" id="email_addr"/>
                    </div>
                    <div>
                        <div>Password</div>
                        <input className="inputBlock" type="text" id="password"/>
                    </div>
                    <div>
                        <div>Password check</div>
                        <input className="inputBlock" type="text" id="password2"/>
                    </div>
                    <button onClick={() => SignUp()}>Sign up</button>
                </div>
            </div>
        </div>
    </div>
  )
}