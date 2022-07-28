import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import VehicleForm from './VehicleForm';

export default function CarPopup({getAllCars}) {
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
        <Button onClick={showModal} type="primary">
            Add Vehicle
        </Button>
        <Modal title="Add a new car" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
            <VehicleForm setIsModalVisible={setIsModalVisible} getAllCars={getAllCars}/>
        </Modal>
      </>
    );
}
