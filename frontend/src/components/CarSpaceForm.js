import React, { useState } from 'react'
export default function CarSpaceForm({ setCarSpaceSelected }) {
    const [address, setAddress] = useState('')
    const [spaceType, setSpaceType] = useState('')
    const [clearance, setClearance] = useState('')
    const [length, setLength] = useState(0)
    const [width, setWidth] = useState(0)

    const updateAddress = (e) => {
        setAddress(e.target.value)
        // console.log(e.target.value);
    }
    const updateSpaceType = (e) => {
        setSpaceType(e.target.value)
        // console.log(e.target.value);
    }

    const updateClearance = (e) => {
        setClearance(e.target.value)
        // console.log(e.target.value);
    }

    const updateLength = (e) => {
        setLength(parseFloat(e.target.value))
        // console.log(parseFloat(e.target.value));
    }
    const updateWidth = (e) => {
        setWidth(parseFloat(e.target.value))
        // console.log(parseFloat(e.target.value));
    }

  return (
    <div>
        <br></br>
        <input type="text" placeholder='please enter address' onChange={updateAddress}/>
        <div>what type of space are you listing?</div>
        <select onChange={updateSpaceType}>
            <option>indoor</option>
            <option>outside</option>
            <option>undercover</option>
            <option>driveway</option>
        </select>
        <div>what is the maximum height</div>
        <select onChange={updateClearance}>
            <option>2</option>
            <option>2.5</option>
            <option>3</option>
            <option>3.5</option>
            <option>4</option>
        </select>
        <div>what is the size of your space?</div>
        Length<input type="number" placeholder='please enter Length' onChange={updateLength}/>
        <br></br>
        Width<input type="number" placeholder='please enter Width' onChange={updateWidth}/>
        <br></br>
        <button onClick={() => setCarSpaceSelected(false)}>close</button>
        <button>submit</button>
    </div>
  )
}
