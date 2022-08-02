import { Space, Table, Tag, Button, Popconfirm, Image } from 'antd';
import React, {useEffect} from 'react';
import PublishButton from './PublishButton';
import EditParkingPopup from './EditParkingPopup';
import ParkingSpaceDetail from "./ParkingSpaceDetail"
import ImageUpload from './ImageUpload';
import base_64 from "./ba64_sample"
import AvailableDate from './AvailableDate';


const ParkingSpaceDisplay = ({carSpaceInformation, setPublishFormSelected, getAllListings}) => {
    //console.log(base_64);
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
            availibility: space.available_periods,
            avatar: space.avatar
            
        })
    })
    console.log("数据： ",dataList);

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

    const getLargePicture = () => {
        console.log("yes");
    }

    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            render: (_, record) => (
                <>  
                    {record.avatar && <Image src={base_64+record.avatar} height="150px"/>}
                    <ImageUpload getAllListings={getAllListings} space_id={record.id}/>
                </>
            ),
        },
        {
          title: 'Address',
          key: 'address',
          render: (_, record) => (
            <Space size="small">
                {record.address}
                <ParkingSpaceDetail record={record}/>
            </Space>
            ),
        },
        {
            title: 'Availability',
            key: 'availibility',
            render: (_, record) => (
                record.availibility.length > 0 ? <AvailableDate record={record}/> : "Not published yet"
            ),
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                {record.availibility.length !== 0 && 
                <Popconfirm 
                    title="Are you sure？" 
                    okText="Yes" 
                    cancelText="No"
                    onConfirm={() => unpublish(record.id)}
                >
                    <Button >Unpublish</Button>
                </Popconfirm>
                }
                {record.availibility.length === 0 && <PublishButton 
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