import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
// import "./Login&register.css"

const LoginForm = () => {
  const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Success:', values);
    const data = {
      "username": values.username,
      "password": values.password
    }
    const requestOption = {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }
    fetch('http://127.0.0.1:5000/login', requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", values.username)
      navigate('/')
    })
    .catch(error => {
      console.log(error)
      alert("login failed")
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const goToLanding = () => {
    navigate('/')
  }

  return (
    <div className='login-form-container'>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <h1 className='register-title'>Login</h1>
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
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="register"
        // valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Link to="/SignUp-page">
            <div className='register-new-account'>Not registered yet?</div>
        </Link>
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
            onClick={goToLanding}
        >
            Close
        </Button>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default LoginForm;