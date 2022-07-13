import React from 'react'
import {Link, useNavigate } from "react-router-dom";
import Header from './Header'
import './login&signup.css'

var password_visible = false
var password = ''
export default function LoginPage() {
    password_visible = false
    const navigate = useNavigate()
    const Login = () => {
        var username = document.getElementById('User_name').value
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
                <div className='all_center'>
                    <div>
                        <div className='all_center'>User name</div>
                        <input className="inputBlock" type="text" id="User_name"/>
                        <div className='all_center'>Password</div>
                        <div>
                            <input onChange={()=>PasswordVisible()} className="inputBlock" type="text" id="password"/>
                            <button onClick={()=>ChangePasswordVisible()} id="password_visible">visible</button>
                        </div>
                        <div className='all_center'>
                            <button onClick={()=>Login()}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
function ChangePasswordVisible(){
    password_visible=!password_visible
    if(password_visible)
    {
        document.getElementById('password_visible').style.color = '#FFF'
        document.getElementById('password_visible').style.backgroundColor = '#000'
    }
    else
    {
        document.getElementById('password_visible').style.color = '#000'
        document.getElementById('password_visible').style.backgroundColor = '#FFF'
    }
    ShowPassword()
}
function PasswordVisible(){
    var password_input = document.getElementById('password').value
    if(password_input.length>password.length)
        password+=password_input.substring(password.length)
    else
        password=password.substring(0,password_input.length)
    //console.log(password)
    ShowPassword()
    //console.log('password')
}
function ShowPassword(){
    if(password_visible)
        document.getElementById('password').value = password
    else 
    {
        var password_show=''
        for(var i=0;i<password.length;i++)
            password_show+='*'
        document.getElementById('password').value = password_show
    }
}