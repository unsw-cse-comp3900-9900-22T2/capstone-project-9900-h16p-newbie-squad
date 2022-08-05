import React, { useState } from 'react'
import Paper from '@mui/material/Paper';
import PriceSlider from './PriceSlider';
import Divider from '@mui/material/Divider';
import PriceSliderMonth from './PriceSliderMonth';
import {Button} from "antd"


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
        <PriceSlider setNewPriceRange={setNewPriceRange}/>
        <div className='price-slider-close'>
          <Button onClick={() => setShowPriceRangePage(false)}>Close</Button>
        </div>
        <div className='price-slider-save'>
          <Button onClick={saveOnclick}>Save</Button>
        </div>
    </Paper>
  )
}
