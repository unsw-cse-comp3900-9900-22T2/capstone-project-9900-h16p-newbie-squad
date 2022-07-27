import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import ParkingSpaceForm from './ParkingSpaceForm';

export default function ParkingPopup({getAllListings}) {
    const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Button type="primary" onClick={showModal} >
          Lease my parking space
        </Button>
        <Modal title="Register a new parking space" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
            <ParkingSpaceForm setIsModalVisible={setIsModalVisible} getAllListings={getAllListings}/>
        </Modal>
      </>
    );
}
