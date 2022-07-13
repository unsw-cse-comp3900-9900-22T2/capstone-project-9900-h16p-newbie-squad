import React from 'react';
import { Outlet, Link,useLocation,useNavigate } from "react-router-dom";

export var token = ''
export var username = ''
export default function Header() {
    const navigate = useNavigate()
    let location = useLocation()
    if(location.state!==null)
    {
        token = location.state.token
        username = location.state.username
        localStorage.setItem("token", token)
        localStorage.setItem("username", username)
    }
    console.log(token,username)
    const Logout = () =>{
      localStorage.setItem("token", '')
      localStorage.setItem("username", '')
      const data = {
        token: '',
      }
      const headers = new Headers({
        'Content-Type': 'application/json',
        });
        fetch('http://localhost:5000/logout',
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
                    navigate('/',{state:{token:'',username:''},replace:true})
                }
            })
    } 

    if(token==='')
    {
    return(
      <div className='header'>
        <div className='go-back-home'>
          <Link to="/"> <button>home-page</button></Link>
        </div>
        <div className='my-account'>
          <Link to="/login-page"> <button>Login</button></Link>
        </div>
        <div className='logout'>
          <Link to="/SignUp-page"> <button>Sign up</button></Link>
        </div>
      </div>
    )
    }
    return (
    <div className='header'>
      <div className='go-back-home'>
        <Link to="/"> <button>home-page</button></Link>
      </div>
      <div className='logout'>
        <button onClick={() => Logout()}>Logout</button>
      </div>
      <div className='welcome'>
        {'welcome,' + localStorage.getItem("username")}
      </div>
      <div className='my-account'>
        <Link to="/personal-info"> <button>My account</button></Link>
        <Outlet />
      </div>
    </div>
    )
}
