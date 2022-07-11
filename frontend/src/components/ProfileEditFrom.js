import React, {useState} from 'react'

export default function ProfileEditFrom({ profile, setProfileEditSelected, getProfile }) {
    const token = localStorage.getItem("token")
    const [username, setUsername] = useState(profile.username)
    const [bio, setBio] = useState("")
    const [email, setEmail] = useState(profile.email)
    const [phone, setPhone] = useState("")

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
    
    const onSubmit = () => {
        const data = {
            username: username,
            bio: bio,
            email: email,
            phone_num: phone
        }
        const requestOption = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify(data)
          }
          fetch("http://127.0.0.1:5000/profile", requestOption)
          .then(res => {
            if (res.status === 200) {
              return res.json()
            } else {
              throw(res)
            }
          })
          .then(data => {
            console.log(data);
            getProfile()
          })
          .catch(error => console.log(error))
          setProfileEditSelected(false)
    }

  return (
    <div>
        <div className='carSpaceForm'>
            Username: <input value={username} onChange={updateUsername}/>
            <br></br>
            Bio: <input onChange={updateBio}/>
            <br></br>
            Email: <input value={email} onChange={updateEmail}/>
            <br></br>
            Phone: <input onChange={updatePhone}/>
            <br></br>
            <button onClick={() => setProfileEditSelected(false)}>close</button>
            <button onClick={onSubmit}>submit</button>
        </div>
    </div>
  )
}
