import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link, useNavigate} from 'react-router-dom';
import { Button, Divider, message } from 'antd';
import Header from './Header';
import './BookingPage.css'
import base_64_header from "./ba64_sample"
import BookingRatingDisplay from './BookingRatingDisplay';

export default function BookingPage() {
    // const listing = JSON.parse(localStorage.getItem("listing-book"))
    // console.log(listing);
    // 此处的listing是object，里面有所有关于该车位的信息的信息
    let timerSec = 0
    let auth_timer = null
    const navigate = useNavigate()
    
    const {carspace_id} = useParams()
    console.log(carspace_id);
    console.log(localStorage.getItem("token"))
    const [timeRemain,setTimeRemain]=useState(0)
    const [bookDisplay,setBookDisplay]=useState(true)
    const [booking_id,setbooking_id]=useState(null)
    const [street,setstreet]=useState(null)
    const [suburb,setsuburb]=useState(null)
    const [state,setstate]=useState(null)
    const [postcode,setpostcode]=useState(null)
    const [price,setprice]=useState(null)
    const [width,setwidth]=useState(null)
    const [length,setlength]=useState(null)
    const [selectDateIndex,setSelectDateIndex]=useState(-1)
    const [availableStartTime,setAvailableStartTime]=useState("")
    const [availableEndTime,setAvailableEndTime]=useState("")
    const [bookedStartTime,setBookedStartTime]=useState("")
    const [bookedEndTime,setBookedEndTime]=useState("")
    const [availability,setAvailability]=useState([])
    const [picture_1,setpicture_1]=useState("")
    const [picture_2,setpicture_2]=useState("")
    const [picture_3,setpicture_3]=useState("")

    const [totalRating,setTotalRating]=useState(3)
    const [starString,setStarSting] = useState("★")
    const [bookingRatingInformation, setBookingRatingInformation] = useState([])

    const GetAllComment = () =>{

      const headers = new Headers({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("token")
        });

        fetch('http://localhost:5000/reviews/parking_space_review/'+carspace_id,
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
              console.log(response)
              setBookingRatingInformation(response.reviews)
                //console.log(ratingSUM)
            }
        })
    }
    const ResetTimer = (e) =>{
      timerSec = e
      setTimeRemain(e)
      auth_timer = setInterval(() => {
        timerSec= timerSec - 1 
        setTimeRemain(timerSec)
        if (timerSec < 0) {
          clearInterval(auth_timer)
          // location.reload()
        }
      }, 1000)
    }
    const SetIndex = (e) =>{
      setSelectDateIndex(e)
      setAvailableStartTime(availability[e].start_date)
      setAvailableEndTime(availability[e].end_date)
      document.getElementById('booking_start_date').value = availability[e].start_date
      document.getElementById('booking_end_date').value = availability[e].end_date
    }
    const MakeBooking = () =>{
      if(localStorage.getItem("token")==='')
      {
        // alert('You should login first')
        message.warning("Please login first")
        navigate(`/login-page`)
        return
      }
      
      var start_date = document.getElementById('booking_start_date').value
      var end_date = document.getElementById('booking_end_date').value
      
      
      if(start_date>end_date)
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
        fetch('http://localhost:5000/bookings/new/'+carspace_id,
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
              setBookedStartTime(start_date)
              setBookedEndTime(end_date)
              setbooking_id(response.new_booking_id.toString())
              setBookDisplay(false)
              ResetTimer(60)
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
              setBookDisplay(true)
              // location.reload()
            }
        })
    }
    const CheckMyBooking = () =>{
      if(localStorage.getItem("token")==='')
      {
        setBookDisplay(true)
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
                //console.log(response.mybookings[i])
              
                if(response.mybookings[i].parking_space_id===parseInt(carspace_id) && response.mybookings[i].status==='Accepted_Payment_Required')
                {  
                  console.log(response.mybookings[i])
                  setBookDisplay(false)
                  setBookedStartTime(response.mybookings[i].start_date)
                  setBookedEndTime(response.mybookings[i].end_date)
                  setbooking_id(response.mybookings[i].booking_id.toString())
                  ResetTimer(parseInt(response.mybookings[i].time_remaining))
                  console.log(booking_id)
                  return
                }
              setBookDisplay(true)
              //bookDisplay(false)
              
            }
        })
    }
    const GetCarSpace = (carspace_id) =>{
      const headers = new Headers({
        'Content-Type': 'application/json',
        });
        fetch('http://localhost:5000/available_parking_spaces/'+carspace_id,
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
              console.log(response)
              
              var listingData=response
              setstreet(listingData.street)
              setsuburb(listingData.suburb)
              setstate(listingData.state)
              setpostcode(listingData.postcode)
              setprice(listingData.price)
              setwidth(listingData.width)
              setlength(listingData.length)
              setAvailability(listingData.availibility)
              setpicture_1(listingData.picture_1)
              setpicture_2(listingData.picture_2)
              setpicture_3(listingData.picture_3)

              
              setTotalRating(listingData.average_rating)
              let stars = '★'
              for(let i=2;i<=5;i++)
                if(listingData.average_rating>=i)
                  stars+='★'
                else
                  stars+='☆'
              setStarSting(stars)
              //catch{}
              //listingAddress=listing.street//, listing.suburb, listing.state, listing.postcode.toString()
                 
            }
        })
    }

    useEffect(() => {
      GetCarSpace(carspace_id)
      CheckMyBooking()
      GetAllComment()
    },[])
    return (
      <div>
        <Header/>
        <div className='information-box'>
          <div className='booking-container'>
            <div className='scrollable-container'>
              <div>
                <div className='address-title'>Address: {street}, {suburb} {state}, {postcode}</div>
                <div>Total rating: {totalRating} {starString}</div>
                <div>Price: {price} AUD/day</div>
                <div>Width: {width}m</div>
                <div>Length: {length}m</div>
                <div><br /></div>
                {bookDisplay &&
                  <div id='book-container'>
                    <div>Available date: </div>
                    {availability.map((time, index) => (
                    <div key={index} id={'available_date_count_'+index}>
                      from {time.start_date} to {time.end_date}  
                      {selectDateIndex != index && 
                      <button onClick={()=>SetIndex(index)} className='book-button'>
                        select
                      </button>}
                      {selectDateIndex == index && 
                      <button className='book-button'>
                      selected
                      </button>
                      }
                    </div>
                    ))}
                    {selectDateIndex >= 0 &&
                    <div>
                      from
                      <input min={availableStartTime} max={availableEndTime} type='date' id='booking_start_date'></input>
                      to
                      <input min={availableStartTime} max={availableEndTime} type='date' id='booking_end_date'></input>
                      <button onClick={()=>MakeBooking()} className='book-button' id='book_button'>
                        book
                      </button>
                    </div>
                    }
                  </div>
                }
                {!bookDisplay &&
                  <div id='unbook-container'>
                    <div>
                      You already booked from {bookedStartTime} to {bookedEndTime}
                    </div>
                    <div>
                    <div>
                      Time remain: {timeRemain} s
                    </div>
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
                }
              </div>
              <div>
                <Divider>Car space previews</Divider>
                <div className='preview-container'>
                  {picture_1 && <img className='car-space-preview' src={base_64_header+picture_1}/>}
                  {picture_2 && <img className='car-space-preview' src={base_64_header+picture_2}/>}
                  {picture_3 && <img className='car-space-preview' src={base_64_header+picture_3}/>}
                </div>
                <br/>
              </div>
              <div >
                <Divider>Reviews</Divider>
                <BookingRatingDisplay 
                  BookingRating={bookingRatingInformation}
                  GetAllComment={GetAllComment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
