import { Button, Checkbox, Form, Input, InputNumber, Upload } from 'antd';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import React, {useState} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { convertBase64 } from '../util/function';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

export default function EditRentingForm({setIsModalVisible, getAllListings, record}) {
  
  const token = localStorage.getItem("token")

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
    console.log('Mydate is True?',values.date)
    const address = values.street + ", " + values.suburb + " " + values.state + ", " + values.postcode
    console.log(address);
    const {lat, lng} = await getLocation(address)
    console.log(lat, lng);
    
    const start_date = ''
    const end_date = ''
    if(values.date)
    {
      start_date = values.date[0].format('YYYY-MM-DD')
      end_date = values.date[1].format('YYYY-MM-DD')
    }
    else
    {
      console.log('why',record["start_date"])
      // start_date = record.start_date
      // end_date = record.end_date
    }

  
    const data = {
        "title": values.title,
        "street": values.street,
        "suburb": values.suburb,
        "state": values.state,
        "postcode": values.postcode,
        "start_date": start_date,
        "end_date": end_date,
        "budget": values.budget,
        "latitude": lat,
        "longitude": lng,
        "others":values.others
    }
    const requestOption = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch(`http://127.0.0.1:5000/myrequest/update/${record.id}`, requestOption)
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
        title: record.title,
        street: record.street,
        suburb: record.suburb,
        state: record.state,
        postcode: record.postcode,
        budget: record.budget,
        others: record.others
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please enter title',
          },
        ]}
      >
        <Input />
      </Form.Item>

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
        label="Budget"
        name="budget"
        rules={[
          {
            required: true,
            validator: validBudget
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[
          {
            // required: true,
          },
        ]}
      >
        <RangePicker defaultValue={[moment(record.start_date, dateFormat), moment(record.end_date, dateFormat)]} format={dateFormat}/>
      </Form.Item>

      <Form.Item
        label="Others"
        name="others"
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