import React, {useState} from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
// import SelectDomain from './SelectDomain'
import { Select } from 'antd';
// import "./Login&register.css"
import "./login&signup.css"
const {Option} = Select


export default function RegisterForm() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    const emailRegex = /\S+@\S+\.\S+/
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const onFinish = (values) => {
        console.log('Success:', values);
        const data = {
            "username": values.username,
            "email": values.email,
            "password": values.password
        }
        const requestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        fetch('http://127.0.0.1:5000/register', requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data =>{
            console.log(data)
            navigate('/login-page')
        })
        .catch(error => {
            console.log(error);
            alert("register failed")
        })
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const validPassword = (_, value) => {
        if (passwordRegex.test(value)) {
            console.log(value);
            return Promise.resolve()
        }
        return Promise.reject(new Error("at least 8 characters, including uppercase, lowercase and number"));
    }
    const validEmail = (_, value) => {
        if (emailRegex.test(value)) {
            console.log(value);
            return Promise.resolve()
        }
        return Promise.reject(new Error("Please input valid email"));
    }

    const updatePassword = (e) => {
        // console.log(e.target.value);
        setPassword(e.target.value)
    }
    const updatePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value)
    }
    const passwordMatch = () => {
        if (password === passwordConfirm) {
            return Promise.resolve()
        }
        return Promise.reject(new Error("password does not match")); 
    }
    const goToLogin = () => {
        navigate('/login-page')
    }
  return (
    <div>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >  
    <div className='register-title'><h1>Register</h1></div>
      
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            // message: 'Please input valid email!',
            validator: validEmail
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            // message: 'Please input your password!',
            validator: validPassword
          }
        ]}
      >
        <Input.Password onChange={updatePassword}/>
      </Form.Item>

      <Form.Item
        label="Password confirm"
        name="password confirm"
        rules={[
          {
            required: true,
            // message: 'Please confirm your password!',
            validator: passwordMatch
          },
        ]}
      >
        <Input.Password onChange={updatePasswordConfirm}/>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button 
            htmlType="button"
            style={{
                margin: '0 8px',
            }}
            onClick={goToLogin}
        >
            close
        </Button>
        <Button 
            type="primary" 
            htmlType="submit" 
        >
            Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}
