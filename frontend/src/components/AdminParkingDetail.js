import { Button, Modal } from 'antd';
import React, { useState } from 'react';

const AdminParkingDetail = ({record}) => {
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
        <p>Length: {record.length}</p>
        <p>Width: {record.width}</p>
      </Modal>
    </>
  );
};

export default AdminParkingDetail;