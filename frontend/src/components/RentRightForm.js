import { Button, Checkbox, Form, Input, InputNumber, Upload } from 'antd';
import { DatePicker, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, {useState} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { convertBase64 } from '../util/function';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

export default function RentRightForm({setIsopen,id}) {
  const token = localStorage.getItem("token")
  console.log('see see id',id)
  const [baseImage, setBaseImage] = useState("")

  // const upLoadImage = async(e) => {
  //   const file = e.target.files[0]
  //   const base64 = await convertBase64(file)
  //   console.log(base64);
  //   setBaseImage(base64)
  // }
  const props = {
    onChange: (info) => {
      console.log(info.fileList);
    },
  };
  const onClose = () => {
    setIsopen(false)
  }


  const onFinish = async(values) => {
    console.log('Success:', values);

  
    const data = {
        "street": values.street,
        "suburb": values.suburb,
        "state": values.state,
        "postcode": values.postcode,
        "price": values.price,
        "comments":values.comments
    }
    const requestOption = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch(`http://127.0.0.1:5000/myrequest/myoffer/new/${id}`, requestOption)
    .then(res => {
        if (res.status === 200) {
            
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
        if(data.new_offer_id)
        {
            setIsopen(false)
        }
        else
        {
            alert('Error') 
        }
        console.log(data)
    })
    .catch(error => {
        console.log(error)
        alert(error)
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const validBudget = (_, value) => {
    if (value > 0 && value <= 500) {
        return Promise.resolve()
    }
    return Promise.reject(new Error("Please input valid budget from 0 to 500"));
  }


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
        label="Street"
        name="street"
        rules={[
          {
            required: true,
            message: 'Please enter street',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Suburb"
        name="suburb"
        rules={[
          {
            required: true,
            message: 'Please enter suburb',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="State"
        name="state"
        rules={[
          {
            required: true,
            message: 'Please enter state',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Postcode"
        name="postcode"
        rules={[
          {
            required: true,
            message: 'Please enter postcode',
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item
        label="Length"
        name="length"
        rules={[
          {
            required: true,
            // message: 'Please enter length',
            validator: validLength
          },
        ]}
      >
        <InputNumber />
      </Form.Item> */}

      {/* <Form.Item
        label="Width"
        name="width"
        rules={[
          {
            required: true,
            // message: 'Please enter width',
            validator: validWidth
          },
        ]}
      >
        <InputNumber />
      </Form.Item> */}

      <Form.Item
        label="Price"
        name="price"
        rules={[
          {
            required: true
          },
        ]}
      >
        <InputNumber />
      </Form.Item>


      <Form.Item
        label="Comments"
        name="comments"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextArea showCount />
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
            onClick={onClose}
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