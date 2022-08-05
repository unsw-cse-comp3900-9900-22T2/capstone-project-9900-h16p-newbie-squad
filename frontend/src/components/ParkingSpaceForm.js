import { Button, Checkbox, Form, Input, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, {useState} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { convertBase64 } from '../util/function';

export default function ParkingSpaceForm({setIsModalVisible, getAllListings}) {
  const token = localStorage.getItem("token")
  const [baseImage, setBaseImage] = useState("")

  const props = {
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const getLocation = async (address) => {
    try {
        const results = await getGeocode({address})
        const {lat, lng} = await getLatLng(results[0])
        return {lat, lng}
    } catch(error) {
        console.log(error);
    }  
  }
  const onFinish = async(values) => {
    console.log('Success:', values);
    const address = values.street + ", " + values.suburb + " " + values.state + ", " + values.postcode
    console.log(address);
    const {lat, lng} = await getLocation(address)
    console.log(lat, lng);
  
    const data = {
        "street": values.street,
        "suburb": values.suburb,
        "state": values.state,
        "postcode": values.postcode,
        "length": values.length,
        "width": values.width,
        "price": values.price,
        "latitude": lat,
        "longitude": lng,
    }
    const requestOption = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch("http://127.0.0.1:5000/myparkingspace/new", requestOption)
    .then(res => {
        if (res.status === 200) {
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
        console.log(data)
        getAllListings()
        setIsModalVisible(false)
    })
    .catch(error => {
        console.log(error)
        alert(error)
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onClose = () => {
    setIsModalVisible(false)
  }

  const validPrice = (_, value) => {
    if (value > 0 && value <= 100) {
        return Promise.resolve()
    }
    return Promise.reject(new Error("Please input valid price from 0 to 100"));
  }

  const validLength = (_, value) => {
    if (value >= 3 && value <= 5) {
        return Promise.resolve()
    }
    return Promise.reject(new Error("Please input valid length from 3 to 5 meters"));
  }

  const validWidth = (_, value) => {
    if (value >= 2 && value <= 4) {
        return Promise.resolve()
    }
    return Promise.reject(new Error("Please input valid width from 2 to 4 meters"));
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

      <Form.Item
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
      </Form.Item>

      <Form.Item
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
      </Form.Item>

      <Form.Item
        label="Daily price"
        name="price"
        rules={[
          {
            required: true,
            validator: validPrice
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      {/* <Form.Item
        label="Image"
        name="image"
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item> */}


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