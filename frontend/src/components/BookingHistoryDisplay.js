import { Space, Table, Tag, Button, Popconfirm } from 'antd';
import React, {useEffect} from 'react';
import {useLocation, useParams, Link} from 'react-router-dom';

const BookingHistoryDisplay = ({bookingInformation}) => {
    const dataList = []
    
    for(let index = bookingInformation.length - 1; index >= 0; index--)
        dataList.push({
            key: index,
            parking_space_id: bookingInformation[index].parking_space_id,
            address: bookingInformation[index].address,
            start_date: bookingInformation[index].start_date,
            end_date: bookingInformation[index].end_date,
            price: bookingInformation[index].price,
            status: bookingInformation[index].status
        })
    console.log("data:  ",dataList);

    const columns = [
        {
            title: 'Address',
            key: 'address',
            render: (_, record) => (
                <Space size="small">
                {record.address}
                <Link to={`/booking-page/${record.parking_space_id}`}>
                    <Button>Detail</Button>
                </Link>
                </Space>
            ),
        },
        {
            title: 'Datetime',
            key: 'datetime',
            render: (_, record) => (
                <Space size="small">
                {record.start_date} - {record.end_date}
                </Space>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            render: (_, record) => (
                <Space size="small">
                {record.price}
                </Space>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Space size="small">
                {record.status}
                </Space>
            ),
        },
    ];
    return <Table columns={columns} dataSource={dataList} pagination={{ pageSize: 5 }}/>;
}

export default BookingHistoryDisplay;