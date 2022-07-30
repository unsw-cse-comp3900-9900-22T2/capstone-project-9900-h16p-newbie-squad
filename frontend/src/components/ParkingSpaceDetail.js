import { Button, Modal, Space } from 'antd';
import React, { useState } from 'react';

const ParkingSpaceDetail = ({record}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log(record);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button  onClick={showModal}>
        View
      </Button>
      <Modal title="Parking space details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}> 
        <img src={record.avatar} height="150px"/>
        <p>Address: {record.address}</p>
        <p>Price: {record.price} AUD/per day</p>
        <p>Length: {record.length}m</p>
        <p>Width: {record.width}m</p>
        Availability: {record.availability.length === 0 ? 
            <p>"Not published yet"</p>
            :
            <Space size="small">
                <p>From {record.availability[0].start_date} to {record.availability[0].end_date}</p>
            </Space>
        }
      </Modal>
    </>
  );
};

export default ParkingSpaceDetail;