import React, { useState, useEffect } from 'react'
import VehicleForm from './VehicleForm';

export default function CarManagementPage() {
  const [addVehicleSelected, setAddVehicleSelected] = useState(false)
  const [vehicleInformation, setVehicleInformation] = useState([])

  const addVehicle = () => {
    // console.log("add cars");
    setAddVehicleSelected(true)
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all cars information");
  }, [])

  return (
    <div>
      <button onClick={addVehicle}>Add Vehicle</button>
      
      {addVehicleSelected && <VehicleForm 
        setAddVehicleSelected={setAddVehicleSelected}
        setVehicleInformation={setVehicleInformation}
      />}


      {vehicleInformation.map((vehicle, index) => (
        <div key={index}>Type: {vehicle.type}, Reg number: {vehicle.reg}</div>
      ))}
    </div>
  )
}
