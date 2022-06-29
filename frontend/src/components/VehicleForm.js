import React, { useState } from 'react'

export default function VehicleForm({ setAddVehicleSelected, setVehicleInformation }) {
  const [regNumber, setRegNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('motor')

  const updateRegInput = (e) => {
    setRegNumber(e.target.value)
    // console.log(e.target.value);
  }
  const updateVehicleType = (e) => {
    setVehicleType(e.target.value)
    // console.log(e.target.value);
  }

  const onSubmit = () => {
    //todo: fetch the backend

    // if successful update the vehicle information
    setVehicleInformation(current => [...current, {
      reg: regNumber,
      type: vehicleType
    }])
    // setAddVehicleSelected(false)
  }
  
  return (
    <div className='vehicleForm'> 
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
        <button onClick={onSubmit}>submit</button>
    </div>
  )
}
