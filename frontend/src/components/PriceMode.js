import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

export default function PriceMode({setPriceMode, priceMode}) {
//   const [mode, setMode] = React.useState('');

  const handleChange = (event) => {
      console.log(event.target.value);
      setPriceMode(event.target.value);
  };

  return (
    <div className='dropdown-price-container'>
        <TextField
            size="small"
            label="Price Mode"
            sx={{ width: 100 }}
            select
            value={priceMode}
            onChange={handleChange}
            InputProps={{ style: { fontSize: 10 } }}
            InputLabelProps={{ style: { fontSize: 10 } }}
        >
            <MenuItem value="day" style={{fontSize: 10}}>Daily</MenuItem>
            <MenuItem value="month"  style={{fontSize: 10}}>Monthly</MenuItem>
        </TextField>
    </div>
  );
}