import React, { useState, useEffect } from 'react'
import VehicleForm from './VehicleForm';

const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function CarManagementPage() {
  const [addVehicleSelected, setAddVehicleSelected] = useState(false)
  const [vehicleInformation, setVehicleInformation] = useState([])

  const addVehicle = () => {
    // console.log("add cars");
    setAddVehicleSelected(true)
  }

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
        'token': token
      },
    }
    fetch(`http://127.0.0.1:5000/mycar${plateNumber}`, requestOption)
    .then(res => {
      if (res.status !== 200) {
        throw(res) 
      }
    })
    .catch(error => console.log(error))
    // getAllCars()
  }

  return (
    <div>
      <button onClick={addVehicle}>Add Vehicle</button>
      
      {addVehicleSelected && <VehicleForm 
        setAddVehicleSelected={setAddVehicleSelected}
        setVehicleInformation={setVehicleInformation}
      />}


      {vehicleInformation.map((vehicle, index) => (
        <div key={index}>
          Brand: {vehicle.brand}, Plate number: {vehicle.plate_number} 
          <button>delete</button>
        </div>
      ))}
    </div>
  )
}
