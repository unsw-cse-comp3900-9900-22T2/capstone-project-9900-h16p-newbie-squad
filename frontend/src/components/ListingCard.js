import React from 'react'
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import BookingButton from './BookingButton';
// import {Link, useNavigate} from 'react-router-dom';


export default function ListingCard({listing, priceMode, setSelected}) {
    const priceMonthly = (price) => {
        return price * 28
    }
    // const navigate = useNavigate();
    // const bookOnclick = () => {
    //     navigate('/test',{state:{listing: listing}});
    // }
  return (
    <Paper className='listing-card'>
        <div className='listing-img'></div>
        <div className='listing-info' onClick={() => setSelected(listing)}>
            {listing.street}, {listing.suburb} {listing.state}, {listing.postcode}
            <div className='date-style'>
                <div>From: {listing.start_date}</div>
                <div>To: {listing.end_date}</div>
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
            
            {/* <Button variant="contained" size="medium" className='book-button'>Book</Button> */}
            {/* <button className='book-button' onClick={bookOnclick}>Book</button> */}
            <BookingButton listing={listing}/>
        </div>
    </Paper>
  )
}
