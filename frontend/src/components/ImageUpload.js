import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal } from 'antd';
import React, {useState} from 'react';
import { convertBase64 } from '../util/function';

const ImageUpload = ({getAllListings, space_id}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [baseImage, setBaseImage] = useState("")
    const token = localStorage.getItem("token")

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        updateImage()
        setIsModalVisible(false);
        // console.log(baseImage);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const upLoadImage = async(e) => {
        const file = e.target.files[0]
        const base64 = await convertBase64(file)
        setBaseImage(base64)
    }

    const updateImage = () => {
        // console.log(baseImage);
        const data = {
            picture_1: baseImage
        }
        const requestOption = {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify(data)
        }
        fetch(`http://127.0.0.1:5000/myparkingspace/${space_id}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log("image uploaded");
            getAllListings()
        })
        .catch(error => {
            console.log(error);
            alert(error)
        })
    }

    
  return(
    <>
      <Button onClick={showModal}>
        Upload image
      </Button>
      <Modal title="Upload image for your parking space" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <input type="file" onChange={upLoadImage}></input>
        <img src={baseImage} height="150px"/>
      </Modal>
    </>
  )
};

export default ImageUpload;