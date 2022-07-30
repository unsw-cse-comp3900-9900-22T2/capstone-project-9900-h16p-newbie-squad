import { Button, Table, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import AdminParkingDetail from './AdminParkingDetail';
import AdminParkingDelete from './AdminParkingDelete';
import AdminParkingEdit from './AdminParkingEdit';

// const data = [];

// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

const AdminDisplay = () => {
  const token = localStorage.getItem("token")
  const [parkingSpace, setParkingSpace] = useState([])
  const columns = [
    {
      title: 'Address',
    //   dataIndex: 'address',
        render: (_, record) => (
            <Space size="small">
                {record.address}
                <AdminParkingDetail record={record}/>
            </Space>
        )
    },
    {
        title: 'Price per day',
        dataIndex: 'price',
    },
    {
        title: 'Action',
        render: (_, record) => (
            <Space size="small">
                <AdminParkingEdit record={record} allParkingForAdmin={allParkingForAdmin}/>
                <AdminParkingDelete parking_id={record.id} allParkingForAdmin={allParkingForAdmin}/>
            </Space>
        )
    },
  ];
  const allParkingForAdmin = () => {
    const requestOption = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
    }
    fetch("http://127.0.0.1:5000/admin/parkingspaces", requestOption)
    .then(res => {
        if(res.status === 200) {
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
        console.log(data.admin_all_parking_spaces);
        // setParkingSpace(data.admin_all_parking_spaces)
        const dataList = []
        data.admin_all_parking_spaces.map((parking, index) => {
            const address = parking.street + ", " + parking.suburb + " " + parking.state + ", " + parking.postcode 
            dataList.push({
                key: index,
                id: parking.id,
                address: address,
                street: parking.street,
                suburb: parking.suburb,
                state: parking.state,
                postcode: parking.postcode,
                price: parking.price,
                length: parking.length,
                width: parking.width,
                availability: parking.available_periods,
                picture_1: parking.picture_1,
                picture_2: parking.picture_2,
                picture_3: parking.picture_3,
            })
        })
        setParkingSpace(dataList)
    })
    .catch(error => {
        console.log(error);
        alert(error)
    })
  }

  useEffect(() => {
    allParkingForAdmin()
  },[])

//   useEffect(() => {
//     console.log(parkingSpace);
//   },[]) 
    console.log(parkingSpace)

  return (
    <div>
      <Table columns={columns} dataSource={parkingSpace} pagination={{ pageSize: 5 }}/>
    </div>
  );
};

export default AdminDisplay;