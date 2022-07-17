import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
// import DatePicker from './DatePicker';


export default function DateRangePage({setShowDateRangePage, setDateRange}) {
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const saveOnclick = () => {
        setShowDateRangePage(false)
        setDateRange([start, end])
    }
  return (
    <Paper className='date-range-page'>
        <div className='plain-text'>Date range</div>
        {/* <DatePicker/> */}
        <div>
            <input type="date" onSelect={(e) => {
                setStart(e.target.value)
                console.log(e.target.value);
            }}/>
        </div>
        <div>
            <input type="date" onSelect={(e) => {
                setEnd(e.target.value)
                console.log(e.target.value);
            }}/>
        </div>
        <button onClick={() => setShowDateRangePage(false)}>Close</button>
        <button onClick={saveOnclick}>Save</button>
    </Paper>
  )
}
