import { Space, Table, Tag, Button, Popconfirm,Alert } from 'antd';
import React, {useEffect} from 'react';
import PublishButton from './PublishButton';
import EditRentingPopup from './EditRentingPopup';
import { render } from '@testing-library/react';
import RentCard from './RentCard.js'


const RentingDisplay = ({carSpaceInformation, setPublishFormSelected, getAllListings}) => {
    //console.log(base_64);
    const token = localStorage.getItem("token")
    const dataList = []
    carSpaceInformation.map((space, index) => {
            dataList.push({
                key: index,
                id: space.id,
                title: space.title,
                start_date:space.start_date,
                end_date: space.end_date,
                budget: space.budget,
                others:space.others,
                postcode:space.postcode,
                state:space.state,
                street:space.street,
                suburb:space.suburb,
                owner: space.owner,
                publish: space.publish
            })
    })
    console.log("数据： ",dataList);

    const publish = (space_id) => {
        const requestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
        }
        fetch(`http://127.0.0.1:5000/myrequest/publish/${space_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                getAllListings()
                return res.json()
            } else {
                alert('Error')
                throw(res)
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    }

    const unpublish = (space_id) => {
        const requestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
        }
        fetch(`http://127.0.0.1:5000/myrequest/unpublish/${space_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                getAllListings()
                return res.json()
            } else {
                alert('Error')
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
        fetch(`http://127.0.0.1:5000/myrequest/delete/${space_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                getAllListings()
                return
            } else {
                // throw(res.error)
                alert("Detele Error")
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
    }

    const columns = [
        {
            title: 'Title',
            key: 'title',
            render: (_, record) => (
                // <Space size="small" onClick={() => (alert(record.title))}>
                //     {record.title}
                // </Space>
                <RentCard
                    getAllListings={getAllListings}
                    record={record}
                />
            ),
        },
        {
          title: 'Budget',
          key: 'budget',
          render: (_, record) => (
            <Space size="small">
                {record.budget}
            </Space>
            ),
        },
        {
            title: 'Date',
            key: 'start_date',
            render: (_, record) => (
            <Space size="small">
                From {record.start_date} To {record.end_date}
            </Space>
            ),
        },
        // {
        //     title: 'Availability',
        //     key: "availability",
        //     render: (_, record) => (
        //         record.availability.length === 0 ? 
        //         "Not published yet"
        //         :
        //         <Space size="small">
        //             From {record.availability[0].start_date} to {record.availability[0].end_date}
        //         </Space>
        //     ),
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                
                <Space size="small">
                    {record.publish}


                {/* 已发布 */}
                {record.publish == true && 
                <Popconfirm 
                    title="Are you sure？" 
                    okText="Yes" 
                    cancelText="No"
                    onConfirm={() => unpublish(record.id)}
                >
                    <Button >Unpublish</Button>
                </Popconfirm>
                }


                {/* 未发布 */}
                {record.publish == false && 
                <Popconfirm 
                    title="Are you sure？" 
                    okText="Yes" 
                    cancelText="No"
                    onConfirm={() => publish(record.id)}
                >
                    <Button >Publish</Button>
                </Popconfirm>
                }



                <EditRentingPopup
                    getAllListings={getAllListings}
                    record={record}
                />

                {/* 删除 */}
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

export default RentingDisplay;