import { Button, Modal, Image } from 'antd';
import React, { useState } from 'react';
import base_64_header from "./ba64_sample"

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
        {record.picture_1 && <Image src={base_64_header+record.picture_1} height="150px"/>}
        <p>Address: {record.address}</p>
        <p>Price: {record.price} AUD/per day</p>
        <p>Length: {record.length}</p>
        <p>Width: {record.width}</p>
      </Modal>
    </>
  );
};

export default AdminParkingDetail;