import React, { useState } from 'react'

const find_carSpace = (carSpaceInformation, carSpaceId) => {
    const carSpace = carSpaceInformation.find(space => space.id === carSpaceId)
    console.log(carSpace);
    return carSpace
}

export default function CarSpaceEditForm({ carSpaceInformation, carSpaceId, setEditFormSelected }) {

    const space = find_carSpace(carSpaceInformation, carSpaceId)

    const [address, setAddress] = useState(space.address)
    const [spaceType, setSpaceType] = useState('indoor')
    const [clearance, setClearance] = useState('')
    const [length, setLength] = useState(space.length)
    const [width, setWidth] = useState(space.width)
    const [price, setPrice] = useState(space.price)

    const updatePrice = (e) => {
        setPrice((e.target.value))
    }

    const updateAddress = (e) => {
        setAddress(e.target.value)
        // console.log(e.target.value);
    }
    const updateSpaceType = (e) => {
        setSpaceType(e.target.value)
        console.log(e.target.value);
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

    const editListing = () => {

        setEditFormSelected(false)
    }
  return (
    <div className='carSpaceForm'>
        <br></br>
        <input type="text" placeholder='please enter address' value={address} onChange={updateAddress}/>
        {/* <div>what type of space are you listing?</div>
        <select onChange={updateSpaceType}>
            <option>indoor</option>
            <option>outside</option>
            <option>undercover</option>
            <option>driveway</option>
        </select> */}
        {/* <div>what is the maximum height</div>
        <select onChange={updateClearance}>
            <option>2</option>
            <option>2.5</option>
            <option>3</option>
            <option>3.5</option>
            <option>4</option>
        </select> */}
        <div>what is the size of your car space?</div>
        Length  <input type="number" placeholder='please enter Length' value={length} onChange={updateLength}/>
        <br></br>
        Width  <input type="number" placeholder='please enter Width' value={width} onChange={updateWidth}/>
        <br></br>
        <input type="number" placeholder='Please enter price' value={price} onChange={updatePrice}/>
        <br></br>
        <button onClick={() => setEditFormSelected(false)}>close</button>
        <button>submit</button>
    </div>
  )
}
