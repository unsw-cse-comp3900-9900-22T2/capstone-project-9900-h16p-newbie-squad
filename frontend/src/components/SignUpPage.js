import React from 'react'
import {Link, useNavigate } from "react-router-dom";
import Header from './Header'
import './login&signup.css'
import RegisterForm from './RegisterForm';

var password_visible1 = false
var password1 = ''
var password_visible2 = false
var password2 = ''
var InvalidUsername=true
var InvalidEmailAddress=true
var InvalidPassword1=true
var InvalidPassword2=true
export default function LoginPage() {
    password1=''
    password2=''
    password_visible1 = false
    password_visible2 = false
    InvalidUsername=true
    InvalidEmailAddress=true
    InvalidPassword1=true
    InvalidPassword2=true
    const navigate = useNavigate()
    const SignUp = () => {
        const username = document.getElementById('user_name').value
        const emailaddr = document.getElementById('email_addr').value
        
        if(InvalidUsername)
        {
            alert('Invalid Username')
            return
        }
        if(InvalidEmailAddress)
        {
            alert('Invalid email address')
            return
        }
        if(InvalidPassword1 || InvalidPassword2)
        {
            alert('Invalid Password')
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
                <RegisterForm/>
            </div>
        </div>
    </div>
  )
}
function CheckUsername(){
    if(document.getElementById('user_name').value.length===0)
    {
        document.getElementById('username_check').style.color='#f00'
        InvalidUsername=true
    }
    else
    {
        document.getElementById('username_check').style.color='#000'
        InvalidUsername=false
    }
}
function CheckEmail(){
    var emailaddr = document.getElementById('email_addr').value
    if(emailaddr.length<7 || emailaddr.indexOf('@')==-1 || emailaddr.substr(emailaddr.length-4)!=='.com' || emailaddr[emailaddr.length-5]=='@')
    {
        InvalidEmailAddress=true
    }
    else
        InvalidEmailAddress=false
    if(InvalidEmailAddress)
        document.getElementById('email_check').style.color='#f00'
    else
        document.getElementById('email_check').style.color='#000'
}
function CheckPassword1(){
    password1 = document.getElementById('password1').value

    var hasNum=false;
    var hasBig=false;
    var hasSmall=false;
    
    if(password1.length>=8)
    {
        for(var i=0;i<password1.length;i++)
        {
            if(!hasNum)
            {
                if(password1[i]>='0'&&password1[i]<='9')
                {
                    hasNum=true
                    continue
                }
            }
            if(!hasBig)
            {
                if(password1[i]>='A'&&password1[i]<='Z')
                {
                    hasBig=true
                    continue
                }
            }
            if(!hasSmall)
            {
                if(password1[i]>='a'&&password1[i]<='z')
                {
                    hasSmall=true
                }
            }
            if(hasSmall&&hasBig&&hasNum)
            {
                InvalidPassword1=false
                break
            }
        }
        if(hasSmall&&hasBig&&hasNum)
        {
            InvalidPassword1=false
        }
        else
        {
            InvalidPassword1=true
        }
    }
    else
        InvalidPassword1=true
    
        CheckPassword2()
    if(InvalidPassword1)
        document.getElementById('password_check1').style.color='#f00'
    else
        document.getElementById('password_check1').style.color='#000'
}
function ChangePasswordVisible1(){
    password_visible1=!password_visible1
    if(password_visible1)
    {
        document.getElementById('password_visible1').style.color = '#FFF'
        document.getElementById('password_visible1').style.backgroundColor = '#000'
        document.getElementById('password1').type='text'
    }
    else
    {
        document.getElementById('password_visible1').style.color = '#000'
        document.getElementById('password_visible1').style.backgroundColor = '#FFF'
        document.getElementById('password1').type='password'
    }
}
function ChangePasswordVisible2(){
    password_visible2=!password_visible2
    if(password_visible2)
    {
        document.getElementById('password_visible2').style.color = '#FFF'
        document.getElementById('password_visible2').style.backgroundColor = '#000'
        document.getElementById('password2').type='text'
    }
    else
    {
        document.getElementById('password_visible2').style.color = '#000'
        document.getElementById('password_visible2').style.backgroundColor = '#FFF'
        document.getElementById('password2').type='password'
    }
}
function CheckPassword2(){
    password2 = document.getElementById('password2').value
    
    if(password2===password1)
        InvalidPassword2=false
    else
        InvalidPassword2=true
    
    if(InvalidPassword2)
        document.getElementById('password_check2').style.color='#f00'
    else
        document.getElementById('password_check2').style.color='#000'
}