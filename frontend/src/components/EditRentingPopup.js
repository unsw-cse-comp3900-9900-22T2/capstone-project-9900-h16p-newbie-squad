import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import EditRentingForm from './EditRentingForm';

export default function EditRentingPopup({getAllListings, record}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    // console.log(record);

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
        <Button onClick={showModal}>
          Edit
        </Button>
        <Modal title="Update my renting space" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
            <EditRentingForm
                setIsModalVisible={setIsModalVisible}
                getAllListings={getAllListings} 
                record={record}
            />
        </Modal>
      </>
    );
}
