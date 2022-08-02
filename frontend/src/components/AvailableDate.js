import { Button, Modal, Calendar } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
const AvailableDate = ({record}) => {
  const location = useLocation()  
  console.log(location);
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


  const valiDate = (dateFormat, period) => {
      return dateFormat >= period.start_date && dateFormat <= period.end_date
  }
  const disabledDate = (current) => {
    const dateFormat = current._d.toISOString().split('T')[0]
    let result = true
    record.availibility.map(period => {
        if (valiDate(dateFormat, period)) {
            result = false
        }
    })
    return result   
  }

//   '/personal-info'
  return (
    <>
      {location.pathname === "/MapAndListing-page" && <div onClick={showModal}>Check availability</div>}  
      {location.pathname === '/personal-info' && 
      <Button onClick={showModal}>
        Availability
      </Button>}  
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Calendar fullscreen={false} disabledDate={disabledDate} />
      </Modal>
    </>
  );
};

export default AvailableDate;