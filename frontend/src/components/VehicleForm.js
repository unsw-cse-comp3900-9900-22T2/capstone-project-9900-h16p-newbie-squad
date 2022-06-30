import React, { useState } from 'react'

// const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function VehicleForm({ setAddVehicleSelected, setVehicleInformation, getAllCars }) {
  const token = localStorage.getItem("token")
  // console.log(token);
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
    const data = {
      "plate_number": regNumber,
      "brand": vehicleType,
    }
    const requestOption = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify(data)
    }
    fetch("http://127.0.0.1:5000/mycar/new", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      getAllCars()
      console.log(data)
    })
    .catch(error => alert("The plate number existed"))

    // if successful update the vehicle information
    // setVehicleInformation(current => [...current, {
    //   plate_number: regNumber,
    //   brand: vehicleType
    // }])
    setAddVehicleSelected(false)
  }
  
  return (
    <div className='vehicleForm'> 
        <br></br>
        <input type="text" placeholder='Enter Plate No' value={regNumber} onChange={updateRegInput}/>
        <input type="text" placeholder='Enter Brand' onChange={updateVehicleType}/>
        {/* <select onChange={updateVehicleType}>
            <option value="motor">motor</option>
            <option value="sedan">sedan</option>
            <option value="suv">suv</option>
            <option value="commercial">commercial</option>
        </select> */}
        <br></br>
        <button onClick={()=>setAddVehicleSelected(false)}>close</button>
        <button onClick={onSubmit}>submit</button>
    </div>
  )
}
