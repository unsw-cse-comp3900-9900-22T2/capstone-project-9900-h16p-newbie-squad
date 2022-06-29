import React, { useState } from 'react'

const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function CarSpaceForm({ setCarSpaceSelected, setCarSpaceInformation }) {
    const [address, setAddress] = useState('')
    const [spaceType, setSpaceType] = useState('indoor')
    const [clearance, setClearance] = useState('')
    const [length, setLength] = useState(0)
    const [width, setWidth] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [price, setPrice] = useState(0)

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

    const updateStartDate = (e) => {
        setStartDate(e.target.value)
        // console.log(e.target.value);
    }

    const updateEndtDate = (e) => {
        setEndDate(e.target.value)
        console.log(e.target.value);
    }

    const onSubmit = () => {
        // todo: I should fetch the backend to update my new car space
        const data = {
            "address": address,
            "length": length,
            "width": width,
            "price": price,
            "start_date": startDate,
            "end_date": endDate
        }
        const requestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(data)
        }
        fetch("http://127.0.0.1:5000/mycarspacelisting/new", requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))

        // if successful, I shoud update my current car space information
        setCarSpaceInformation(current => [...current, {
            address: address,
            price: price
        }])
        setCarSpaceSelected(false)
    }

  return (
    <div className='carSpaceForm'>
        <br></br>
        <input type="text" placeholder='please enter address' onChange={updateAddress}/>
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
        Length  <input type="number" placeholder='please enter Length' onChange={updateLength}/>
        <br></br>
        Width  <input type="number" placeholder='please enter Width' onChange={updateWidth}/>
        <div>what is the availability your car space?</div>
        Start  <input type="date" onChange={updateStartDate}/>
        <br></br>
        End  <input type="date" onChange={updateEndtDate}/>
        <br></br>
        <input type="number" placeholder='Please enter price' onChange={updatePrice}/>
        <br></br>
        <button onClick={() => setCarSpaceSelected(false)}>close</button>
        <button onClick={onSubmit}>submit</button>
    </div>
  )
}
