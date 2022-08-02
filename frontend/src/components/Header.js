import React from 'react';
import { Outlet, Link,useLocation,useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LoginIcon from '@mui/icons-material/Login';
import {LoginOutlined} from '@ant-design/icons';
import {Button} from 'antd'

export default function Header() {
    const navigate = useNavigate()
    let location = useLocation()
    if(location.state!==null)
    {
        localStorage.setItem("token", location.state.token)
        localStorage.setItem("username", location.state.username)
    }
    //console.log(localStorage)
    //console.log(token,username)
    const Logout = () =>{
      const data = {
        token: localStorage.getItem("token"),
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
                    localStorage.setItem("token", '')
                    localStorage.setItem("username", '')
                    navigate('/',{state:{token:'',username:''},replace:true})
                }
            })
    } 

    if(localStorage.getItem("token")==='')
    {
    return(
      <div className='header'>
        <div className='go-back-home'>
          <Link to="/"> <HomeOutlinedIcon fontSize='large'/></Link>
        </div>
        <div className='my-account'>
          <Link to="/login-page"> 
            {/* <LoginIcon/> */}
            Login
          </Link>
        </div>
        <div className='sign-up'>
          <Link to="/SignUp-page"> Sign up</Link>
        </div>
      </div>
    )
    }
    return (
    <div className='header'>
      <div className='go-back-home'>
        <Link to="/"> <HomeOutlinedIcon fontSize='large'/></Link>
      </div>
      <div className='logout'>
        {/* <button onClick={() => Logout()}>Logout</button> */}
        <LogoutIcon onClick={() => Logout()}/>
      </div>
      <div className='welcome'>
        {'Welcome, ' + localStorage.getItem("username")}
      </div>
      
      {localStorage.getItem("username") !== "Admin" &&
        <div className='my-account'>
          <Link to="/personal-info"> <AccountCircleRoundedIcon sx={{ color: 'white' }}/> </Link>
          <Outlet />
        </div>
      }
    </div>
    )
}
