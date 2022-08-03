import { Space, Table, Tag, Button, Popconfirm } from 'antd';
import React, {useEffect} from 'react';
import {useLocation, useParams, Link} from 'react-router-dom';
import BookingRaing from './BookingRating';

const BookingHistoryDisplay = ({bookingInformation, isHistory}) => {
    const dataList = []
    for(let index = bookingInformation.length - 1; index >= 0; index--)
    {
        var startDate = new Date(bookingInformation[index].start_date)
        var endDate = new Date(bookingInformation[index].end_date)

        var totalCost = bookingInformation[index].price * (1 + (endDate-startDate)/(24*1000*3600))
        
        dataList.push({
            key: index,
            booking_id: bookingInformation[index].booking_id,
            parking_space_id: bookingInformation[index].parking_space_id,
            address: bookingInformation[index].address,
            start_date: bookingInformation[index].start_date,
            end_date: bookingInformation[index].end_date,
            price: totalCost,
            status: bookingInformation[index].status
        })
    }
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
                {(isHistory && record.status == "Successful")&& <BookingRaing record={record.booking_id}/>}
               
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
            title: 'Cost(AUD)',
            key: 'cost',
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