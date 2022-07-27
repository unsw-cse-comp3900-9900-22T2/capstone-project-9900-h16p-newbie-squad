import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
// import DatePicker from './DatePicker';
import { DatePicker, Space, Button } from 'antd';
import "./BookingPage.css"
import { style } from '@mui/system';

export default function DateRangePage({setShowDateRangePage, setDateRange}) {
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const saveOnclick = () => {
        setShowDateRangePage(false)
        setDateRange([start, end])
    }
    const updateStart = (value, dateString) => {
        setStart(dateString)
        console.log(dateString);
    }
    const updateEnd = (value, dateString) => {
        setEnd(dateString)
        console.log(dateString);
    }
  return (
    <Paper className='date-range-page'>
        <div className='plain-text'>Date range</div>
        {/* <DatePicker/> */}
        <div style={{margin: "5px"}}><DatePicker onChange={updateStart} /></div>
        <div style={{margin: "5px"}}><DatePicker onChange={updateEnd} /></div>
        <Button onClick={() => setShowDateRangePage(false)} style={{margin: "3px"}}>Close</Button>
        <Button onClick={saveOnclick}>Save</Button>
    </Paper>
  )
}
