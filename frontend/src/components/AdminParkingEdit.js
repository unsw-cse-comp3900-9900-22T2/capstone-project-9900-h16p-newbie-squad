import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import EditParkingForm from './EditParkingForm';

export default function AdminParkingEdit({record, allParkingForAdmin}) {
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
        <Modal title="Update my parking space" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
            <EditParkingForm 
                setIsModalVisible={setIsModalVisible}
                getAllListings={allParkingForAdmin} 
                record={record}
            />
        </Modal>
      </>
    );
}
