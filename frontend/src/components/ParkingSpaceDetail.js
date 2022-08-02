import { Button, Modal, Space } from 'antd';
import React, { useState } from 'react';
import base_64 from "./ba64_sample"

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
        <p>Address: {record.address}</p>
        <p>Price: {record.price} AUD/per day</p>
        <p>Length: {record.length}m</p>
        <p>Width: {record.width}m</p>
        <p>Availability: {record.availability.length === 0 
            ? "Not published yet"
            :
            <Space size="small">
                From {record.availability[0].start_date} to {record.availability[0].end_date}
            </Space>
            }
        </p> 
      </Modal>
    </>
  );
};

export default ParkingSpaceDetail;