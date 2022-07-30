import { message, Popconfirm, Button } from 'antd';
import React from 'react';



const AdminParkingDelete = ({parking_id, allParkingForAdmin}) => {
    const token = localStorage.getItem("token")
    console.log(parking_id)
    const delteByAdmin = () => {
        const requestOption = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
        }
        fetch(`http://127.0.0.1:5000/admin/delete/${parking_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                allParkingForAdmin()
            } else {
                throw(res)
            }
        })
        .catch(error => {
            console.log(error);
            alert("Deletion failed")
        })
    }

    const confirm = (e) => {
        delteByAdmin()
    };
    return (
        <Popconfirm
        title="Are you sure to delete this parking space?"
        onConfirm={confirm}
        okText="Yes"
        cancelText="No"
        >
            <Button danger>Delete</Button>
        </Popconfirm>
    )
  
};

export default AdminParkingDelete;