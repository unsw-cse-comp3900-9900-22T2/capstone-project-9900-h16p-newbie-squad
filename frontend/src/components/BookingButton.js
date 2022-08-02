import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {Button} from 'antd'

export default function BookingButton({listing}) {
    // const navigate = useNavigate();
    const bookOnclick = () => {
        // navigate('/test',{state:{listing: listing}});
        localStorage.setItem("listing-book", JSON.stringify(listing))
    }
  return (
    <Link to={`/booking-page/${listing.parking_space_id}`}>
        <Button onClick={bookOnclick} size="small" type='primary'>Detail</Button>
    </Link>
  )
}
