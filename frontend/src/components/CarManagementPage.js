import React, { useState, useEffect } from 'react'
import VehicleForm from './VehicleForm';
import { Button, Divider, Popconfirm } from 'antd';
import './CarManagementPage.css'
import CarPopup from './CarPopup';
import CarDisplay from './CarDisplay';


export default function CarManagementPage() {
  const token = localStorage.getItem("token")
  const [vehicleInformation, setVehicleInformation] = useState([])

  const getAllCars = () => {
    const requestOption = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
    }
    fetch("http://127.0.0.1:5000/mycar", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      console.log(data)
      setVehicleInformation([...data.mycars])
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all cars information");
    getAllCars()
  }, [])

  const deleteCar = (plateNumber) => {
    const requestOption = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
    }
    fetch(`http://127.0.0.1:5000/mycar/${plateNumber}`, requestOption)
    .then(res => {
      if (res.status !== 200) {
        throw(res) 
      } else {
        getAllCars()
      }
    })
    .catch(error => console.log(error))
    // getAllCars()
  }

  return (
    <div>
      <div className='add-car-container'>
        <CarPopup getAllCars={getAllCars}/>
      </div>

      <Divider>All my cars</Divider>
      
      <CarDisplay vehicleInformation={vehicleInformation} deleteCar={deleteCar}/>
    </div>
  )
}
