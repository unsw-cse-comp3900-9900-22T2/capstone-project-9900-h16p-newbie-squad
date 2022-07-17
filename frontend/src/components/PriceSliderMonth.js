import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}$`;
}

export default function PriceSliderMonth({ setNewPriceRange }) {
  const [value, setValue] = React.useState([100, 1000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setNewPriceRange(newValue)
  };

  return (
    <Box sx={{ width: 180 }} className="price-slider">
      <Slider
        getAriaLabel={() => 'price range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
      <div>hello</div>
    </Box>
  );
}
