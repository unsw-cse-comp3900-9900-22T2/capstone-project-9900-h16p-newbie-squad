import { Space, Table, Tag, Button, Popconfirm } from 'antd';
import React, {useEffect} from 'react';
import PublishButton from './PublishButton';
import EditParkingPopup from './EditParkingPopup';
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
    // console.log(carSpaceInformation);
    const token = localStorage.getItem("token")
    const dataList = []
    carSpaceInformation.map((space, index) => {
        const address = space.street + ", " + space.suburb + " " + space.state + ", " + space.postcode
        dataList.push({
            key: index,
            id: space.id,
            address: address,
            street: space.street,
            suburb: space.suburb,
            state: space.state,
            postcode: space.postcode,
            price: space.price,
            length: space.length,
            width: space.width,
            availability: space.available_periods
        })
    })
    console.log(dataList);

    const unpublish = (space_id) => {
        const requestOption = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
        }
        fetch(`http://127.0.0.1:5000/myparkingspace/unpublish/${space_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                getAllListings()
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    }
    const deleteSpace = (space_id) => {
        const requestOption = {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'token': token
          },
        }
        fetch(`http://127.0.0.1:5000/myparkingspace/${space_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                getAllListings()
                return
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    }

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
                {record.availability.length !== 0 && 
                <Popconfirm 
                    title="Are you sure？" 
                    okText="Yes" 
                    cancelText="No"
                    onConfirm={() => unpublish(record.id)}
                >
                    <Button >Unpublish</Button>
                </Popconfirm>
                }
                {record.availability.length === 0 && <PublishButton 
                    setPublishFormSelected={setPublishFormSelected}
                    carSpaceId={record.id}
                    getAllListings={getAllListings}
                />}
                {/* <Button>Edit</Button> */}
                <EditParkingPopup
                    getAllListings={getAllListings}
                    record={record}
                />
                <Popconfirm 
                    title="Are you sure？" 
                    okText="Yes" 
                    cancelText="No"
                    onConfirm={() => deleteSpace(record.id)}
                >
                    <Button >Delete</Button>
                </Popconfirm>
                {/* <Button onClick={() => console.log(record)}>test</Button> */}
                </Space>
            ),
        },
      ];
    return <Table columns={columns} dataSource={dataList} pagination={{ pageSize: 5 }}/>;
}

export default ParkingSpaceDisplay;