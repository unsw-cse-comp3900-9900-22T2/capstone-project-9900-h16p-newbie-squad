import { Button, Checkbox, Form, Input, InputNumber } from 'antd';
import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

export default function EditParkingForm({setIsModalVisible, getAllListings, record}) {
  const token = localStorage.getItem("token")
  console.log(record);

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
    console.log("坐标： ",lat, lng);
  
    const data = {
        "street": values.street,
        "suburb": values.suburb,
        "state": values.state,
        "postcode": values.postcode,
        "length": values.length,
        "width": values.width,
        "price": values.price,
        "latitude": lat,
        "longitude": lng
    }
    const requestOption = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch(`http://127.0.0.1:5000/myparkingspace/${record.id}`, requestOption)
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
        street: record.street,
        suburb: record.suburb,
        state: record.state,
        postcode: record.postcode,
        length: record.length,
        width: record.width,
        price: record.price
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
            message: 'Please enter length',
          },
        ]}
      >
        <InputNumber min={3} max={8} />
      </Form.Item>

      <Form.Item
        label="Width"
        name="width"
        rules={[
          {
            required: true,
            message: 'Please enter width',
          },
        ]}
      >
        <InputNumber min={2} max={5} />
      </Form.Item>

      <Form.Item
        label="Daily price"
        name="price"
        rules={[
          {
            required: true,
            message: 'Please enter daily price',
          },
        ]}
      >
        <InputNumber />
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