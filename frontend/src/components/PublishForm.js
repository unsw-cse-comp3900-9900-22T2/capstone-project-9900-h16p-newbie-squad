import React, { useState } from 'react'

export default function PublishForm({ setPublishFormSelected }) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const updateStartDate = (e) => {
        setStartDate(e.target.value)
        // console.log(e.target.value);
    }

    const updateEndtDate = (e) => {
        setEndDate(e.target.value)
        console.log(e.target.value);
    }

    const publish = () => {
        // const data = {
        //     "start_date": startDate,
        //     "end_date": endDate
        // }
        // const requestOption = {
        //     method: "PUT",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'token': token
        //     },
        //     body: JSON.stringify(data)
        // }
        // fetch(`http://127.0.0.1:5000/mycarspacelisting/publish/${}`, requestOption)
        // .then(res => {
        //     if (res.status === 200) {
        //         return res.json()
        //     } else {
        //         throw(res)
        //     }
        // })
        // .then(data => {
        //     console.log(data)
        // })
        // .catch(error => console.log(error))
    }
    return (
        <div>
            <br></br>
            <div>what is the availability your car space?</div>
            Start  <input type="date" onChange={updateStartDate}/>
            <br></br>
            End  <input type="date" onChange={updateEndtDate}/>
            <br></br>
            <button onClick={() => setPublishFormSelected(false)}>close</button>
            <button>confirm</button>
            <br></br>
            <br></br>
        </div>
    )
}
