// import React, { useState } from 'react'

// // const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

// export default function VehicleForm({ setAddVehicleSelected, setVehicleInformation, getAllCars }) {
//   const token = localStorage.getItem("token")
//   // console.log(token);
//   const [regNumber, setRegNumber] = useState('')
//   const [vehicleType, setVehicleType] = useState('motor')

//   const updateRegInput = (e) => {
//     setRegNumber(e.target.value)
//     // console.log(e.target.value);
//   }
//   const updateVehicleType = (e) => {
//     setVehicleType(e.target.value)
//     // console.log(e.target.value);
//   }

  // const onSubmit = () => {
  //   //todo: fetch the backend
  //   const data = {
  //     "plate_number": regNumber,
  //     "brand": vehicleType,
  //   }
  //   const requestOption = {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'token': token
  //     },
  //     body: JSON.stringify(data)
  //   }
  //   fetch("http://127.0.0.1:5000/mycar/new", requestOption)
  //   .then(res => {
  //     if (res.status === 200) {
  //       return res.json()
  //     } else {
  //       throw(res)
  //     }
  //   })
  //   .then(data => {
  //     getAllCars()
  //     console.log(data)
  //   })
  //   .catch(error => alert("The plate number existed"))

  //   // if successful update the vehicle information
  //   // setVehicleInformation(current => [...current, {
  //   //   plate_number: regNumber,
  //   //   brand: vehicleType
  //   // }])
  //   setAddVehicleSelected(false)
  // }
  
//   return (
//     <div className='vehicleForm'> 
//         <br></br>
//         <input type="text" placeholder='Enter Plate No' value={regNumber} onChange={updateRegInput}/>
//         <input type="text" placeholder='Enter Brand' onChange={updateVehicleType}/>
//         <br></br>
//         <button onClick={()=>setAddVehicleSelected(false)}>close</button>
//         <button onClick={onSubmit}>submit</button>
//     </div>
//   )
// }

import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';

const VehicleForm = ({setIsModalVisible, getAllCars}) => {
  const token = localStorage.getItem("token")
  const onSubmit = (values) => {
    //todo: fetch the backend
    const data = {
      "plate_number": values.plate_number,
      "brand": values.brand,
    }
    const requestOption = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify(data)
    }
    fetch("http://127.0.0.1:5000/mycar/new", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      getAllCars()
      setIsModalVisible(false)
      console.log(data)
    })
    .catch(error => alert("The plate number existed"))
  }
  const onFinish = (values) => {
    console.log('Success:', values);
    onSubmit(values)
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
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
      <Form.Item
        label="Plate number"
        name="plate_number"
        rules={[
          {
            required: true,
            message: 'Please input plate number!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Brand"
        name="brand"
        rules={[
          {
            required: true,
            message: 'Please enter brand',
          },
        ]}
      >
        <Input placeholder='BMW'/>
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
            onClick={() => setIsModalVisible(false)}
        >
            Close
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VehicleForm;
