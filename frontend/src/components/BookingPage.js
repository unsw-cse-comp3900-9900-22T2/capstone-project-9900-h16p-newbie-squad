import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import Header from './Header';
import './BookingPage.css'

export default function BookingPage() {
    // const listing = JSON.parse(localStorage.getItem("listing-book"))
    // console.log(listing);
    // 此处的listing是object，里面有所有关于该车位的信息的信息
    const {listing_id} = useParams()
    console.log(listing_id);
    console.log(localStorage.getItem("token"))
    const [booking_id,setbooking_id]=useState(null)
    const [street,setstreet]=useState(null)
    const [suburb,setsuburb]=useState(null)
    const [state,setstate]=useState(null)
    const [postcode,setpostcode]=useState(null)
    const [price,setprice]=useState(null)
    const [width,setwidth]=useState(null)
    const [length,setlength]=useState(null)
    const [startTime,setstartTime]=useState(null)
    const [endTime,setendTime]=useState(null)
    const MakeBooking = () =>{
      if(localStorage.getItem("token")==='')
      {
        alert('You should login first')
        return
      }
      
      var start_date = document.getElementById('booking_start_date').value
      var end_date = document.getElementById('booking_end_date').value
      
      if(start_date <startTime || end_date>endTime || start_date==='' ||end_date==='' ||start_date>end_date)
      {
        alert('Invalid book time')
        return
      }
      const data = {
        start_date: start_date,
        end_date: end_date
      }
      
      const headers = new Headers({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("token")
        });
        console.log(JSON.stringify(data))
        fetch('http://localhost:5000/bookings/new/'+listing_id,
        {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: headers,
        })
        .then(res => res.json())
        .catch(error => {
            console.error('Error:', error)
        })
        .then(response => {
            if(response.error !== undefined)
            {
                alert(response.error)
                console.log(response.error)
            }
            else 
            {
              console.log(response)
              setbooking_id(response.new_booking_id.toString())
              bookDisplay(true)
            }
        })
    }
    const UnBook = () =>{
      const headers = new Headers({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("token")
        });
        fetch('http://localhost:5000/bookings/cancel/'+booking_id,
        {
            method: 'POST',
            headers: headers,
        })
        .then(res => res.json())
        .catch(error => {
            console.error('Error:', error)
        })
        .then(response => {
            if(response.error !== undefined)
            {
                alert(response.error)
                console.log(response.error)
            }
            else 
            {
              console.log(response)
              bookDisplay(false)
            }
        })
    }
    const CheckMyBooking = () =>{
      if(localStorage.getItem("token")==='')
      {
        bookDisplay(false)
        return
      }
      const headers = new Headers({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("token")
        });

        fetch('http://localhost:5000/bookings/mybookings',
        {
            method: 'GET',
            headers: headers,
        })
        .then(res => res.json())
        .catch(error => {
            console.error('Error:', error)
        })
        .then(response => {
            if(response.error !== undefined)
            {
                alert(response.error)
                console.log(response.error)
            }
            else 
            {
              console.log(response.mybookings)
              for(var i in response.mybookings)
                if(response.mybookings[i].listing_id===parseInt(listing_id) && response.mybookings[i].status==='Accepted_Payment_Required')
                {  
                  bookDisplay(true)
                  setbooking_id(response.mybookings[i].booking_id.toString())
                  console.log(booking_id)
                  return
                }
              bookDisplay(false)
            }
        })
    }
    const GetListing = (listing_id) =>{
      const headers = new Headers({
        'Content-Type': 'application/json',
        });
        
        fetch('http://localhost:5000/listings/'+listing_id,
        {
            method: 'GET',
            headers: headers,
        })
        .then(res => res.json())
        .catch(error => {
            console.error('Error:', error)
        })
        .then(response => {
            if(response.error !== undefined)
            {
                alert(response.error)
                console.log(response.error)
            }
            else 
            {
              var listingData=response
              setstreet(listingData.street)
              setsuburb(listingData.suburb)
              setstate(listingData.state)
              setpostcode(listingData.postcode)
              setprice(listingData.price)
              setwidth(listingData.width)
              setlength(listingData.length)
              setstartTime(listingData.start_date)
              setendTime(listingData.end_date)
              //listingAddress=listing.street//, listing.suburb, listing.state, listing.postcode.toString()
                 
            }
        })
    }

    useEffect(() => {
      GetListing(listing_id)
      CheckMyBooking()
    },[])
    return (
      <div>
        <Header/>
        <div className='information-box'>
          <div className='booking-container'>
            <div className='scrollable-container'>
              <div className='bottom-border'>
                <div>Address: {street}, {suburb} {state}, {postcode}</div>
                <div>Price: {price}/day</div>
                <div>Width: {width}m</div>
                <div>Length: {length}m</div>
                <div>Available date: {startTime} to {endTime}</div>
                <div><br /></div>
                  <div id='book-container'>
                    from
                    <input type='date' id='booking_start_date'></input>
                    to
                    <input type='date' id='booking_end_date'></input>
                    <button onClick={()=>MakeBooking()} className='book-button' id='book_button'>
                      book
                    </button>
                  </div>
                  <div id='unbook-container'>
                    <button onClick={()=>UnBook()} className='book-button' id='book_button'>
                      unbook
                    </button>
                    <Link to={`/pay-page/${booking_id}`}>
                    <button className='pay-button' id='book_button'>
                      pay
                    </button>
                    </Link>
                  </div>
              </div>
              <div className='bottom-border'>
                <div>Preview</div>
                <div className='car-space-preview'>
                  No preview
                </div>
              </div>
              <div>
                <div>some reviews here(sprint3 work)</div>
              </div>
            </div>

            <div>
              <div>Owner: </div>
              <div className='user-icon'>
                No preview
              </div>
              <div>rating: 5.0</div>
            </div>
          </div>
        </div>
      </div>
    )
}
function bookDisplay(booked){
  if(booked)
  {
    try{
      document.getElementById('unbook-container').style.display='block'
      document.getElementById('book-container').style.display='None'
    }
    catch{}
  }
  else
  {
    try{
      document.getElementById('unbook-container').style.display='None'
      document.getElementById('book-container').style.display='Block'
    }
    catch{}
  }
}