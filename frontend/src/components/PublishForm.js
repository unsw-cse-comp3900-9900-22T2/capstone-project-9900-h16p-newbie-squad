import React, { useState } from 'react'

// const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function PublishForm({ setPublishFormSelected, carSpaceId, getAllListings, setStartDate, setEndDate}) {
    // const token = localStorage.getItem("token")
    // const [startDate, setStartDate] = useState('')
    // const [endDate, setEndDate] = useState('')
    const updateStartDate = (e) => {
        setStartDate(e.target.value)
        console.log(e.target.value);
    }

    const updateEndtDate = (e) => {
        setEndDate(e.target.value)
        console.log(e.target.value);
    }

    // const publish = () => {
    //     const data = {
    //         "start_date": startDate,
    //         "end_date": endDate
    //     }
    //     const requestOption = {
    //         method: "PUT",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'token': token
    //         },
    //         body: JSON.stringify(data)
    //     }
    //     fetch(`http://127.0.0.1:5000/myparkingspace/publish/${carSpaceId}`, requestOption)
    //     .then(res => {
    //         if (res.status === 200) {
    //             return res.json()
    //         } else {
    //             throw(res)
    //         }
    //     })
    //     .then(data => {
    //         console.log(data)
    //         getAllListings()
    //     })
    //     .catch(error => console.log(error))

    //     setPublishFormSelected(false)
    // }
    return (
        <div>
            <br></br>
            <div>what is the availability your car space?</div>
            Start  <input type="date" onChange={updateStartDate}/>
            <br></br>
            End  <input type="date" onChange={updateEndtDate}/>
            <br></br>
            <button onClick={() => setPublishFormSelected(false)}>close</button>
            {/* <button onClick={publish}>confirm</button> */}
            <br></br>
            <br></br>
        </div>
    )
}
