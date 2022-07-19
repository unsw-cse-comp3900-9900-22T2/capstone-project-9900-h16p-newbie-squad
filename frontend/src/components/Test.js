import React from 'react'
import {useLocation} from 'react-router-dom';

export default function Test() {
    // const token = localStorage.getItem("token")
    const location = useLocation()
    const listing = location.state.listing
    console.log(listing);
  return (
    <div>Booking</div>
  )
}
