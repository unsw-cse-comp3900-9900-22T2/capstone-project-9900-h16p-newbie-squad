import React, { useState } from 'react'
import VehicleForm from './VehicleForm';

export default function CarManagementPage() {
  const [addVehicleSelected, setAddVehicleSelected] = useState(false)
  const addVehicle = () => {
    // console.log("add cars");
    setAddVehicleSelected(true)
  }
  return (
    <div>
      <button onClick={addVehicle}>Add Vehicle</button>
      {addVehicleSelected && <VehicleForm setAddVehicleSelected={setAddVehicleSelected}/>}
    </div>
  )
}
