import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import RentForm from './RentForm.js';

export default function RentPopup({getAllListings}) {
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
          Add a parking request
        </Button>
        <Modal title="Request a new parking space" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
            <RentForm setIsModalVisible={setIsModalVisible} getAllListings={getAllListings}/>
        </Modal>
      </>
    );
}
