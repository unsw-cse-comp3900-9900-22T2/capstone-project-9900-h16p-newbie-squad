import React, { useState } from 'react'

const find_carSpace = (carSpaceInformation, carSpaceId) => {
    const carSpace = carSpaceInformation.find(space => space.id === carSpaceId)
    // console.log(carSpace);
    return carSpace
}

export default function CarSpaceEditForm({ carSpaceInformation, carSpaceId, setEditFormSelected, getAllListings }) {
    const token = localStorage.getItem("token")

    const space = find_carSpace(carSpaceInformation, carSpaceId)

    const [spaceType, setSpaceType] = useState('indoor')
    const [clearance, setClearance] = useState('')
    const [length, setLength] = useState(space.length)
    const [width, setWidth] = useState(space.width)
    const [price, setPrice] = useState(space.price)
    const [street, setStreet] = useState(space.street)
    const [suburb, setSuburb] = useState(space.suburb)
    const [state, setState] = useState(space.state)
    const [postcode, setPostcode] = useState(space.postcode)

    const updateStreet = (e) => {
        setStreet(e.target.value)
    }

    const updateSuburb = (e) => {
        setSuburb(e.target.value)
    }

    const updateState = (e) => {
        setState(e.target.value)
    }

    const updatePostcode = (e) => {
        setPostcode(e.target.value)
    }

    const updatePrice = (e) => {
        setPrice((e.target.value))
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
        if (parseFloat(e.target.value) < 1.5) {
            setLength(1.5)
            return
        }
        setLength(parseFloat(e.target.value))
        // console.log(parseFloat(e.target.value));
    }
    const updateWidth = (e) => {
        if (parseFloat(e.target.value) < 1.5) {
            setWidth(2)
            return
        }
        setWidth(parseFloat(e.target.value))
        // console.log(parseFloat(e.target.value));
    }

    const editListing = () => {
        const data = {
            "street": street,
            "suburb": suburb,
            "state": state,
            "postcode": postcode,
            "length": length,
            "width": width,
            "price": price,
        }
        const requestOption = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(data)
        }
        fetch(`http://127.0.0.1:5000/myparkingspace/${carSpaceId}`, requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data);
            getAllListings()
        })
        .catch(error => console.log(error))

        setEditFormSelected(false)
    }
  return (
    <div className='carSpaceForm'>
        <br></br>
        Street <input type="text"  value={street} onChange={updateStreet}/>
        <br></br>
        Suburb <input type="text"  value={suburb} onChange={updateSuburb}/>
        <br></br>
        State <input type="text"  value={state} onChange={updateState}/>
        <br></br>
        Postcode <input type="text"  value={postcode} onChange={updatePostcode}/>
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
        Length  <input type="number" min="1.5" placeholder='please enter Length' value={length} onChange={updateLength}/>
        <br></br>
        Width  <input type="number" placeholder='please enter Width' value={width} onChange={updateWidth}/>
        <br></br>
        <input type="number" placeholder='Please enter price' value={price} onChange={updatePrice}/>
        <br></br>
        <button onClick={() => setEditFormSelected(false)}>close</button>
        <button onClick={editListing}>submit</button>
    </div>
  )
}
