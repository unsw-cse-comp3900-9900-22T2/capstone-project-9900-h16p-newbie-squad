import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import Header from './Header';
import './BookingPage.css'
import { Button, Divider } from 'antd';
import "./CarSpacePage.css"
import BookingHistoryDisplay from './BookingHistoryDisplay';

export default function BookingHistoryPage(){
    const token = localStorage.getItem("token")
    const [displayHistory,setDisplayHistory] = useState(true)
    const [displayRecieved,setDisplayRecieved] = useState(false)
    const [bookingInformation, setbookingInformation] = useState([])
    const [bookingToMeInformation, setbookingToMeInformation] = useState([])
    
    const DisplayhistoryButton = () =>{
      setDisplayHistory(true)
      setDisplayRecieved(false)
    }

    const DisplayRecievedButton = () =>{
      setDisplayHistory(false)
      setDisplayRecieved(true)
    }
    
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
        fetch("http://127.0.0.1:5000//bookings/my_received_bookings", requestOption)
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            throw(res)
          }
        })
        .then(response => {
          console.log(response)
          setbookingToMeInformation([...response.my_received_bookings])
          console.log(bookingToMeInformation)
        })
        .catch(error => console.log(error))
      }
      useEffect(() => {
        GetMyBookings()
        GetToMeBookings()
      }, [])
    return(
      <div>
        {displayHistory &&
          <div>
          <div className='release-button'>
          <Button type="primary" onClick={DisplayRecievedButton}>
            Go to recieved bookings
          </Button>
          </div>
          <Divider>Booking history</Divider>
          <BookingHistoryDisplay 
            bookingInformation={bookingInformation}
          />
          </div>
        }
        {displayRecieved &&
          <div>
          <div className='release-button'>
          <Button type="primary" onClick={DisplayhistoryButton}>
            Go to booking history
          </Button>
          </div>
          <Divider>Recieved bookings</Divider>
          <BookingHistoryDisplay 
            bookingInformation={bookingToMeInformation}
          />
          </div>
        }
    </div>
    )
}