import React, { useState } from 'react'

// const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function CarSpaceForm({ setCarSpaceSelected, setCarSpaceInformation, getAllListings }) {
    const token = localStorage.getItem("token")
    const [spaceType, setSpaceType] = useState('indoor')
    const [clearance, setClearance] = useState('')
    const [length, setLength] = useState(0)
    const [width, setWidth] = useState(0)
    const [price, setPrice] = useState(0)
    const [street, setStreet] = useState('')
    const [suburb, setSuburb] = useState("")
    const [state, setState] = useState('')
    const [postcode, setPostcode] = useState('')

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

    const onSubmit = () => {
        // todo: I should fetch the backend to update my new car space
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
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(data)
        }
        fetch("http://127.0.0.1:5000/myparkingspace/new", requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data)
            getAllListings()
        })
        .catch(error => console.log(error))

        // if successful, I shoud update my current car space information
        // setCarSpaceInformation(current => [...current, {
        //     address: address,
        //     price: price
        // }])
        setCarSpaceSelected(false)
    }

  return (
    <div className='carSpaceForm'>
        <br></br>
        {/* <input type="text" placeholder='please enter address' onChange={updateAddress}/> */}
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
        Street <input type="text" onChange={updateStreet}/>
        <br></br>
        Suburb <input type="text" onChange={updateSuburb}/>
        <br></br>
        State <input type="text" onChange={updateState}/>
        <br></br>
        Postcode <input type="text" onChange={updatePostcode}/>
        <br></br>
        <div>what is the size of your car space?</div>
        Length  <input type="number" placeholder='please enter Length' onChange={updateLength}/> meter
        <br></br>
        Width  <input type="number" placeholder='please enter Width' onChange={updateWidth}/> meter
        <br></br>
        <input type="number" placeholder='Please enter price' onChange={updatePrice}/> per day
        <br></br>
        <button onClick={() => setCarSpaceSelected(false)}>close</button>
        <button onClick={onSubmit}>submit</button>
    </div>
  )
}
