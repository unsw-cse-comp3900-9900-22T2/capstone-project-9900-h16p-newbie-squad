import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider';
import RentingCards from './RentingCards';
import PriceMode from './PriceMode';
import Button from '@mui/material/Button';
import PriceRangePage from './PriceRangePage';
import DateRangePage from './DateRangePage'
import PriceSort from './PriceSort';

export default function ShowRentings({ listings,AllListings,setSelected }) {
    
    
  return (
    <div>
        {listings.map((listing, index) => (
            <div key={index} className="listing-card-container" >
                <RentingCards listing={listing} setSelected={setSelected}/>
            </div>
        ))}
    </div>
  )
}
