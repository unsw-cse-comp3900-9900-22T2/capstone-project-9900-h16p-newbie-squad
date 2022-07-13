import React from 'react'
import {Link, useNavigate } from "react-router-dom";
import Header from './Header'
import './login&signup.css'

var password_visible1 = false
var password1 = ''
var password_visible2 = false
var password2 = ''
var InvalidUsername=true
var InvalidEmailAddress=true
var InvalidPassword1=true
var InvalidPassword2=true
export default function LoginPage() {
    const navigate = useNavigate()
    const SignUp = () => {
        const username = document.getElementById('user_name').value
        const emailaddr = document.getElementById('email_addr').value
        console.log(emailaddr.substr(emailaddr.length-4))
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
                <div className='all_center'>
                    <div>
                    <div>
                        <div id='username_check' className='inputCheck'>User name</div>
                        <input onChange={()=>CheckUsername()} className="inputBlock" type="text" id="user_name"/>
                        </div>
                    <div>
                        <div id='email_check' className='inputCheck'>Email address</div>
                        <input onChange={()=>CheckEmail()} className="inputBlock" type="text" id="email_addr"/>
                        </div>
                    <div>
                        <div id='password_check1' className='inputCheck'>Password</div>
                        <input onChange={()=>CheckPassword1()} className="inputBlock" type="text" id="password1"/>
                        <button onClick={()=>ChangePasswordVisible1()} id="password_visible1">visible</button>
                    </div>
                    <div>
                        <div id='password_check2' className='inputCheck'>Password check</div>
                        <input onChange={()=>CheckPassword2()} className="inputBlock" type="text" id="password2"/>
                        <button onClick={()=>ChangePasswordVisible2()} id="password_visible2">visible</button>
                    </div>
                    <button onClick={() => SignUp()}>Sign up</button>
                    </div>
                </div>
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
    var password_input = document.getElementById('password1').value
    if(password_input.length>password1.length)
        password1+=password_input.substring(password1.length)
    else
        password1=password1.substring(0,password_input.length)
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
    
    if(InvalidPassword1)
        document.getElementById('password_check1').style.color='#f00'
    else
        document.getElementById('password_check1').style.color='#000'
    ShowPassword1()
}
function ChangePasswordVisible1(){
    password_visible1=!password_visible1
    if(password_visible1)
    {
        document.getElementById('password_visible1').style.color = '#FFF'
        document.getElementById('password_visible1').style.backgroundColor = '#000'
    }
    else
    {
        document.getElementById('password_visible1').style.color = '#000'
        document.getElementById('password_visible1').style.backgroundColor = '#FFF'
    }
    ShowPassword1()
}
function ShowPassword1(){
    if(password_visible1)
        document.getElementById('password1').value = password1
    else 
    {
        var password_show=''
        for(var i=0;i<password1.length;i++)
            password_show+='*'
        document.getElementById('password1').value = password_show
    }
}
function ChangePasswordVisible2(){
    password_visible2=!password_visible2
    if(password_visible2)
    {
        document.getElementById('password_visible2').style.color = '#FFF'
        document.getElementById('password_visible2').style.backgroundColor = '#000'
    }
    else
    {
        document.getElementById('password_visible2').style.color = '#000'
        document.getElementById('password_visible2').style.backgroundColor = '#FFF'
    }
    ShowPassword2()
}
function CheckPassword2(){
    var password_input = document.getElementById('password2').value
    if(password_input.length>password2.length)
        password2+=password_input.substring(password2.length)
    else
        password2=password1.substring(0,password_input.length)
    
    if(password2===password1)
        InvalidPassword2=false
    else
        InvalidPassword2=true
    
    if(InvalidPassword2)
        document.getElementById('password_check2').style.color='#f00'
    else
        document.getElementById('password_check2').style.color='#000'
    ShowPassword2()
}
function ShowPassword2(){
    if(password_visible2)
        document.getElementById('password2').value = password2
    else 
    {
        var password_show=''
        for(var i=0;i<password2.length;i++)
            password_show+='*'
        document.getElementById('password2').value = password_show
    }
}