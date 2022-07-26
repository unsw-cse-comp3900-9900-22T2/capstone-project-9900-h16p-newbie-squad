import { Button, Modal, Space, DatePicker } from 'antd';
import React, { useState } from 'react';
// import PublishForm from './PublishForm';

const PublishButton = ({ setPublishFormSelected, carSpaceId, getAllListings }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = localStorage.getItem("token")
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const updateStartDate = (value, dateString) => {
    setStartDate(dateString)
    console.log(dateString);
  }

  const updateEndtDate = (value, dateString) => {
    setEndDate(dateString)
    console.log(dateString);
  }
  const publish = () => {
    const data = {
        "start_date": startDate,
        "end_date": endDate
    }
    const requestOption = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch(`http://127.0.0.1:5000/myparkingspace/publish/${carSpaceId}`, requestOption)
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
    })
    .catch(error => console.log(error))

    // setPublishFormSelected(false)
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    publish()
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Publish
      </Button>
      <Modal title="Publish this parking space" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {/* Start  <input type="date" onChange={updateStartDate}/> */}
        <Space direction="vertical">
          From <DatePicker onChange={updateStartDate} />
        </Space>
        {/* <br></br> */}
        <Space direction="vertical">
          To <DatePicker onChange={updateEndtDate} />
        </Space>
        {/* End  <input type="date" onChange={updateEndtDate}/> */}
      </Modal>
    </>
  );
};

export default PublishButton;