// import React, { useState } from 'react'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function DatePicker() {
    const [value, setValue] = React.useState(new Date('2014-08-18'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
            label="Date desktop"
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
        />
    </LocalizationProvider>
  )
}
