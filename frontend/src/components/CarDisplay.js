import React from 'react'
import { Table, Popconfirm, Button } from 'antd';



export default function CarDisplay({vehicleInformation, deleteCar}) {
    const token = localStorage.getItem("token")
    const dataList = []
    vehicleInformation.map((car, index) => {
        dataList.push({
            key: index,
            id: car.id,
            plate_number: car.plate_number,
            brand: car.brand
        })
    })
    const columns = [
        {
            title: 'Plate number',
            dataIndex: 'plate_number',
            key: 'plate_number',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    onConfirm={() => deleteCar(record.plate_number)}
                    title="Are you sure to delete this car?"
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            )
        }
    ]
    return <Table columns={columns} dataSource={dataList} pagination={{ pageSize: 5 }}/>;
}
