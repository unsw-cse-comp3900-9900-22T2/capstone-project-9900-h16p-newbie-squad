import { Space,Button, Modal } from 'antd';
import React, { useState } from 'react';
import RentCardForm from './RentCardForm';

export default function RentCard({getAllListings, record}) {
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
        {/* <Button onClick={showModal}>
          Edit
        </Button> */}
        <Space size="small" onClick={showModal}>
            {record.title}
        </Space>
        <Modal visible={isModalVisible}  onCancel={handleCancel} footer={null}>
            <RentCardForm
                setIsModalVisible={setIsModalVisible}
                getAllListings={getAllListings} 
                record={record}
            />
        </Modal>
      </>
    );
}
