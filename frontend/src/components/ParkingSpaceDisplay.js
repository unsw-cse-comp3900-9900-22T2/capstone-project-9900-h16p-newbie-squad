import { Space, Table, Tag, Button } from 'antd';
import React, {useEffect} from 'react';
import PublishButton from './PublishButton';
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const ParkingSpaceDisplay = ({carSpaceInformation, setPublishFormSelected, getAllListings}) => {
    console.log(carSpaceInformation);
    const dataList = []
    carSpaceInformation.map((space, index) => {
        const address = space.street + ", " + space.suburb + " " + space.state + ", " + space.postcode
        dataList.push({
            key: index,
            id: space.id,
            address: address,
            price: space.price,
            length: space.length,
            width: space.width,
            availability: space.available_periods
        })
    })
    console.log(dataList);

    const columns = [
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Price',
            key: 'price',
            render: (_, record) => (
            <Space size="small">
                {record.price}AUD/day
            </Space>
            ),
        },
        {
            title: 'Length',
            key: "length",
            render: (_, record) => (
            <Space size="small">
                {record.length}m
            </Space>
            ),
        },
        {
            title: 'Width',
            key: "width",
            render: (_, record) => (
            <Space size="small">
                {record.width}m
            </Space>
            ),
        },
        {
            title: 'Availability',
            key: "availability",
            render: (_, record) => (
            
            record.availability.length === 0 ? 
            "Not published yet"
            :
            <Space size="small">
                From {record.availability[0].start_date} to {record.availability[0].end_date}
            </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                {/* {record.availability.length === 0 && <Button onClick={() => setPublishFormSelected(true)}>Publish</Button>} */}
                {record.availability.length !== 0 && <Button >Unpublish</Button>}
                {record.availability.length === 0 && <PublishButton 
                    setPublishFormSelected={setPublishFormSelected}
                    carSpaceId={record.id}
                    getAllListings={getAllListings}
                />}
                <Button>Edit</Button>
                <Button>Delete</Button>
                </Space>
            ),
        },
      ];
    return <Table columns={columns} dataSource={dataList} />;
}

export default ParkingSpaceDisplay;