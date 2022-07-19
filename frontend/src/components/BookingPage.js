import { jsx } from '@emotion/react';
import React from 'react'
import {useLocation, useParams} from 'react-router-dom';
import Header from './Header';

export default function BookingPage() {
    const listing = JSON.parse(localStorage.getItem("listing-book"))
    console.log(listing);
    // 此处的listing是object，里面有所有关于该车位的信息的信息

  return (
    <div>
      <Header/>
      Booking
    </div>
  )
}
