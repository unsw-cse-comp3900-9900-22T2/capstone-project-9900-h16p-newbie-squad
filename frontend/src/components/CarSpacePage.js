import React, { useState, useEffect } from 'react'
import CarSpaceForm from './CarSpaceForm'
export default function CarSpacePage() {
  const [carSpaceSelected, setCarSpaceSelected] = useState(false)
  const [carSpaceInformation, setCarSpaceInformation] = useState([])
  const leaseCarSpace = () => {
    setCarSpaceSelected(true)
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all of my car spaces");
  }, [])
  
  return (
    <div>
      <button onClick={leaseCarSpace}>Lease my car space</button>
      {carSpaceSelected && <CarSpaceForm 
        setCarSpaceSelected={setCarSpaceSelected}
        setCarSpaceInformation={setCarSpaceInformation}
      />}

      {carSpaceInformation.map((space, index) => (
        <div key={index}>address at: {space.address},   type: {space.type}</div>
      ))}
    </div>
  )
}
