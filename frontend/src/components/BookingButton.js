import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {Button, message} from 'antd'

export default function BookingButton({listing}) {
    const navigate = useNavigate();
    const goToLogin = () => {
      message.warning("Please login first")
      navigate('/login-page')
    }
  return (
    <>
       {/* {localStorage.getItem("token") && <Link to={`/booking-page/${listing.parking_space_id}`}>
        <Button size="small" type='primary'>Detail</Button>
      </Link>}
      {!localStorage.getItem("token") && <Button size="small" type='primary' onClick={goToLogin}>Detail</Button>} */}
      <Link to={`/booking-page/${listing.parking_space_id}`}>
        <Button size="small" type='primary'>Detail</Button>
      </Link>
    </>
  )
}
