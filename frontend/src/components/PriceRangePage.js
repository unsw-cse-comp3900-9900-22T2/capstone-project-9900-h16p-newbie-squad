import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import PriceSlider from './PriceSlider';
import Divider from '@mui/material/Divider';
import PriceSliderMonth from './PriceSliderMonth';


export default function PriceRangePage({setShowPriceRangePage, setPriceRange, priceRange, priceMode }) {
    const [newPriceRange, setNewPriceRange] = useState(priceRange)
    const saveOnclick = () => {
        setShowPriceRangePage(false)
        setPriceRange(newPriceRange)
    }
  return (
    <Paper className='price-range-page'>
        <div className='plain-text'>Show listings priced between</div>
        <p>{newPriceRange[0]} and {newPriceRange[1]}/day</p>
        {/* {priceMode === 'day' ? 
            <PriceSlider setNewPriceRange={setNewPriceRange}/>
            : 
            <PriceSliderMonth setNewPriceRange={setNewPriceRange}/>
        } */}
        <PriceSlider setNewPriceRange={setNewPriceRange}/>
        {/* <Divider className='price-slider-divider'/> */}
        <button className='price-slider-close' onClick={() => setShowPriceRangePage(false)}>Close</button>
        <button className='price-slider-save' onClick={saveOnclick}>Save</button>
    </Paper>
  )
}
