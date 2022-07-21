import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import Header from './Header';
import './BookingPage.css'


export default function BookingHistoryPage(){
    const token = localStorage.getItem("token")
    const [bookingInformation, setbookingInformation] = useState([])
    const [bookingToMeInformation, setbookingToMeInformation] = useState([])
    const GetMyBookings = () => {
        const requestOption = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
        }
        fetch("http://127.0.0.1:5000//bookings/mybookings", requestOption)
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            throw(res)
          }
        })
        .then(response => {
          console.log(response)
          setbookingInformation([...response.mybookings])
          console.log(bookingInformation)
        })
        .catch(error => console.log(error))
      }
      const GetToMeBookings = () => {
        const requestOption = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
        }
        fetch("http://127.0.0.1:5000//bookings/mylistings", requestOption)
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            throw(res)
          }
        })
        .then(response => {
          console.log(response)
          setbookingToMeInformation([...response.myRequests])
          console.log(bookingToMeInformation)
        })
        .catch(error => console.log(error))
      }
      useEffect(() => {
        GetMyBookings()
        GetToMeBookings()
      }, [])
    return(
        <div className='booking-history-container'>
            <div className='scrollable-container'>
                <div>Booking to others</div>
                <div><br /></div>
                {bookingInformation.map((booking, index) => (
                    <div key={index} className='bottom-border'>
                        <div>Address: {booking.address}</div>
                        <div>Booked time: {booking.start_date} to {booking.end_date} </div>
                        <div>Price: {booking.price}</div>
                        <div>Statu: {booking.status}</div>
                        <Link to={`/booking-page/${booking.listing_id}`}>
                            <button className='book-button'>Detail</button>
                        </Link>
                    </div>
                ))}
            </div>
            <div className='scrollable-container'>
                <div>Booking to me</div>
                <div><br /></div>
                {bookingToMeInformation.map((booking, index) => (
                    <div key={index} className='bottom-border'>
                        <div>Address: {booking.address}</div>
                        <div>Booked time: {booking.start_date} to {booking.end_date} </div>
                        <div>Price: {booking.price}/day</div>
                        <div>Statu: {booking.status}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}