import React, { useState } from 'react'

export default function VehicleForm({ setAddVehicleSelected }) {
  const [regNumber, setRegNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const updateRegInput = (e) => {
    setRegNumber(e.target.value)
    // console.log(e.target.value);
  }
  const updateVehicleType = (e) => {
    setVehicleType(e.target.value)
    // console.log(e.target.value);
  }
  return (
    <div>
        <br></br>
        <input type="text" placeholder='Enter Reg No' value={regNumber} onChange={updateRegInput}/>
        <select onChange={updateVehicleType}>
            <option value="motor">motor</option>
            <option value="sedan">sedan</option>
            <option value="suv">suv</option>
            <option value="commercial">commercial</option>
        </select>
        <br></br>
        <button onClick={()=>setAddVehicleSelected(false)}>close</button>
        <button>submit</button>
    </div>
  )
}
