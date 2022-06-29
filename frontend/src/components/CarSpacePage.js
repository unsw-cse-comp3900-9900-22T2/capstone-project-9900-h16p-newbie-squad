import React, { useState, useEffect } from 'react'
import CarSpaceForm from './CarSpaceForm'

const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function CarSpacePage() {
  const [carSpaceSelected, setCarSpaceSelected] = useState(false)
  const [carSpaceInformation, setCarSpaceInformation] = useState([])
  const leaseCarSpace = () => {
    setCarSpaceSelected(true)
  }
  const getAllListings = () => {
    const requestOption = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
    }
    fetch("http://127.0.0.1:5000/mycarspacelisting", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      console.log(data)
      setCarSpaceInformation([...data.all_listings])
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all of my car spaces");
    getAllListings()
  }, [])
  
  return (
    <div>
      <button onClick={leaseCarSpace}>Lease my car space</button>
      {carSpaceSelected && <CarSpaceForm 
        setCarSpaceSelected={setCarSpaceSelected}
        setCarSpaceInformation={setCarSpaceInformation}
      />}

      {carSpaceInformation.map((space, index) => (
        <div key={index}>address at: {space.address},   Price: {space.price}</div>
      ))}
    </div>
  )
}
