import React from 'react'
import {Link, useNavigate} from 'react-router-dom';

export default function BookingButton({listing}) {
    // const navigate = useNavigate();
    const bookOnclick = () => {
        // navigate('/test',{state:{listing: listing}});
        localStorage.setItem("listing-book", JSON.stringify(listing))
    }
  return (
    <Link to={`/booking-page/${listing.listing_id}`}>
        <button className='book-button' onClick={bookOnclick}>Book</button>
    </Link>
  )
}
