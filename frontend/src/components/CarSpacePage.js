import React, { useState } from 'react'
import CarSpaceForm from './CarSpaceForm'
export default function CarSpacePage() {
  const [carSpaceSelected, setCarSpaceSelected] = useState(false)
  const leaseCarSpace = () => {
    setCarSpaceSelected(true)
  }
  return (
    <div>
      <button onClick={leaseCarSpace}>Lease my car space</button>
      {carSpaceSelected && <CarSpaceForm setCarSpaceSelected={setCarSpaceSelected}/>}
    </div>
  )
}
