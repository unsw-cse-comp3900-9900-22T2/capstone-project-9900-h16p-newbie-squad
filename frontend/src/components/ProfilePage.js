import React, { useState } from 'react'
import { useEffect } from 'react'
import {message} from 'antd'

export default function ProfilePage() {
  const [digemail, setDigemail] = useState('')
  const [digpassword, setDigpassword] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [newemail, setNewemail] = useState('')
  const [checknewemail, setChecknewemail] = useState('')
  const [newpassword, setNewpassword] = useState('')
  const [checknewpassword, setChecknewpassword] = useState('')
  const openEmail = (e) => {
    setDigemail(1)
  }
  const closeEmail = (e) => {
    setNewemail('')
    setChecknewemail('')
    setDigemail(0)
  }
  const openPassword = (e) => {
    setDigpassword(1)
  }
  const closePassword = (e) => {
    setNewpassword('')
    setChecknewpassword('')
    setDigpassword(0)
  }
  const updateUsername = (e) => {
    setUsername(e.target.value)
  }
  const updateBio = (e) => {
    setBio(e.target.value)
  }
  const updateEmail = (e) => {
    setEmail(e.target.value)
  }
  const updatePhone = (e) => {
    setPhone(e.target.value)
  }
  const updatenewEmail = (e) => {
    setNewemail(e.target.value)
  }
  const updatechecknewEmail = (e) => {
    setChecknewemail(e.target.value)
  }
  const updatenewPassword = (e) => {
    setNewpassword(e.target.value)
  }
  const updatechecknewPassword = (e) => {
    setChecknewpassword(e.target.value)
  }

  const updateBackEmail = () => {
    const data = {
      "email": newemail
    }
    const headers = new Headers({
      'Content-Type': 'application/json',
      'token': localStorage.getItem("token")
      });
      fetch('http://localhost:5000/profile',
      {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      })
      .then(res => res.json())
      .catch(error => {
          console.error('Error:', error)
      })
      .then(response => {
          console.log(response)
          message.success("Email updated successfully")
          closeEmail()
          initUser()
      })
  }
  

  const verifyEmail = () => {
    if(newemail && checknewemail && newemail == checknewemail)
    {
      updateBackEmail()
    }
    else
    {
      alert('Email is Error')
    }
  }


  const updateBackPassword = () => {
    const data = {
      "password": newpassword
    }
    const headers = new Headers({
      'Content-Type': 'application/json',
      'token': localStorage.getItem("token")
      });
      fetch('http://localhost:5000/profile',
      {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      })
      .then(res => res.json())
      .catch(error => {
          console.error('Error:', error)
      })
      .then(response => {
          console.log(response)
          message.success("Password updated successfully")
          closePassword()
          initUser()
      })
  }

  const verifyPassword = () => {
    if(newpassword && checknewpassword && newpassword == checknewpassword)
    {
      updateBackPassword()
    }
    else
    {
      alert('Password is Error')
    }
  }


  const updateBackUser = () => {
    const data = {
      // "username": username,
      "phone_num": phone
    }
    const headers = new Headers({
      'Content-Type': 'application/json',
      'token': localStorage.getItem("token")
      });
      fetch('http://localhost:5000/profile',
      {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      })
      .then(res => res.json())
      .catch(error => {
          console.error('Error:', error)
      })
      .then(response => {
          console.log(response)
          initUser()
          // alert('Update Success')
          message.success("Update success")
      })
  }


  const verifyUser = () => {
    if(username)
    {
      updateBackUser()
    }
    else
    {
      alert('username is null')
    }
  }


  const initUser = () => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'token': localStorage.getItem("token")
      });
      fetch('http://localhost:5000/profile',
      {
          method: 'GET',
          headers: headers,
      })
      .then(res => res.json())
      .catch(error => {
          console.error('Error:', error)
      })
      .then(response => {
          console.log(response)
          setUsername(response.username)
          setEmail(response.email)
          setPhone(response.phone_num)
          // if(response.phone_num)
          // {
          //   setPhone(response.phone_num)
          // }
          // else
          // {
          //   setPhone('')
          // }
          
      })
  }
  
  useEffect(() => {     //  模拟componentDidMount  首次渲染
      console.log('use effect')
      initUser()
  },[])    // 空数组必须写

  
  if(digemail == 1){
    return (
      <div className='profileMain'>
       <div className='profileContent'>
         <h2>User</h2>
         <div className='profileitems'>
           <h5 className='profileH5'>New Email</h5>
           <input value={newemail} onChange={updatenewEmail}/>
         </div>
         <div className='profileitems'>
           <h5 className='profileH5'>Check Email</h5>
           <input value={checknewemail} onChange={updatechecknewEmail}/>
         </div>
         <div>
          <button className='profileButton' onClick={closeEmail}>Back</button>
          <button className='profileButton' onClick={verifyEmail}>Save</button>
         </div>
       </div>
    </div>
    )
  }
  if(digpassword == 1){
    return (
      <div className='profileMain'>
       <div className='profileContent'>
         <h2>User</h2>
         <div className='profileitems'>
           <h5 className='profileH5'>New Password</h5>
           <input value={newpassword} onChange={updatenewPassword} type="password"/>
         </div>
         <div className='profileitems'>
           <h5 className='profileH5'>Check Password</h5>
           <input value={checknewpassword} onChange={updatechecknewPassword} type="password"/>
         </div>
         <div>
          <button className='profileButton' onClick={closePassword}>Back</button>
          <button className='profileButton' onClick={verifyPassword}>Save</button>
         </div>
       </div>
    </div>
    )
  }
  return (
    <div className='profileMain'>
       <div className='profileContent'>
         <h2>User</h2>
         <div className='profileitems'>
           <h5 className='profileH5'>Username</h5>
           <input value={username} onChange={updateUsername} disabled/>
         </div>
         <div className='profileitems'>
           <h5 className='profileH5'>Email</h5>
           <input value={email} onChange={updateEmail} disabled/>
           <div className='profileChange' onClick={openEmail}>Change Emial</div>
         </div>
         <div className='profileitems'>
           <h5 className='profileH5'>Password</h5>
           <input  value="ddddddddddddddddddd" type="password" disabled/>
           <div className='profileChange' onClick={openPassword}>Change Password</div>
         </div>
         <div className='profileitems'>
           <h5 className='profileH5'>PhoneNumber</h5>
           <input onChange={updatePhone} value={phone ? phone : ''}/>
         </div>
         <button className='profileButton' onClick={verifyUser}>Save</button>
       </div>
    </div>
  )
}
