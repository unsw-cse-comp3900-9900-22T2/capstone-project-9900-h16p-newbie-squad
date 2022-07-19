import React from 'react'
import {Link, useNavigate} from 'react-router-dom';

export default function BookingButton({listing}) {
    const navigate = useNavigate();
    const bookOnclick = () => {
        navigate('/test',{state:{listing: listing}});
    }
  return (
    <button className='book-button' onClick={bookOnclick}>Book</button>
  )
}
