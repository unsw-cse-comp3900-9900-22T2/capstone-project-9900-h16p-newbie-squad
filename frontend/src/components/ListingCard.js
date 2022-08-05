import React from 'react'
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import BookingButton from './BookingButton';
import {Image} from "antd"
import base_64 from "./ba64_sample"
import AvailableDate from './AvailableDate';
// import {Link, useNavigate} from 'react-router-dom';


export default function ListingCard({listing, priceMode, setSelected}) {
    console.log(listing);
    const priceMonthly = (price) => {
        return price * 28
    }
    
  return (
    <Paper className='listing-card'>
        <div className='listing-img'>
            {listing.avatar && <Image width={55} height={55} src={base_64+listing.avatar}/>}
        </div>

        <div className='listing-info' onClick={() => setSelected(listing)}>
            {listing.street}, {listing.suburb} {listing.state}, {listing.postcode}
            <div className='date-style'>
                
                <AvailableDate record={listing}/>
            </div>
        </div>
        <div className='price-book'>
            {priceMode === 'day' ? 
                <div>
                    <div className='price'>{listing.price}</div>
                    <div className='per-day'>per day</div>
                </div>
                :
                <div>
                    <div className='price'>{priceMonthly(listing.price)}</div>
                    <div className='per-day'>per month</div>
                </div>
            }
            <BookingButton listing={listing}/>
        </div>
    </Paper>
  )
}
