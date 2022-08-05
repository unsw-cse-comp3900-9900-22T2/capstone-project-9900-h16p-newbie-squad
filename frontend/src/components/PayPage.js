import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link, useNavigate} from 'react-router-dom';
import Header from './Header';
import { Button, Divider, message } from 'antd';
import './login&signup.css'

export default function BookingPage() {
    const navigate = useNavigate()
    const {booking_id} = useParams()
    const {carspace_id} = useParams()
    const {start_Date} = useParams()
    const {end_Date} = useParams()
    console.log(booking_id)
    console.log(carspace_id)
    console.log(start_Date)
    console.log(end_Date)

    const [street,setstreet]=useState(null)
    const [suburb,setsuburb]=useState(null)
    const [state,setstate]=useState(null)
    const [postcode,setpostcode]=useState(null)
    const [price,setprice]=useState(null)
    const [width,setwidth]=useState(null)
    const [length,setlength]=useState(null)
    const [totalCost,setTotalCost]=useState(null)

    const [creditCardNumber,setCreditCardNumber]=useState("")
    const [creditCardName,setCreditCardName]=useState("")
    const [creditCardCVV,setCreditCardCVV]=useState("")
    const [creditCardExpiredDate,setCreditCardExpiredDate]=useState("")

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
                
                var startDate = new Date(start_Date)
                var endDate = new Date(end_Date)

                console.log(startDate,endDate)
                //console.log("days",(endDate-startDate)/(24*1000*3600))
                setTotalCost(listingData.price * (1 + (endDate-startDate)/(24*1000*3600)))
                /*
                setAvailability(listingData.availibility)
                setpicture_1(listingData.picture_1)
                setpicture_2(listingData.picture_2)
                setpicture_3(listingData.picture_3)
  
                
                    */
              }
          })
    }
    const GetCreditCard = () =>{
        if(localStorage.getItem("token")==='')
        {
          alert('You should login first')
          return
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'token': localStorage.getItem("token")
            });
            fetch('http://localhost:5000/profile/credit_card',
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
                    setCreditCardNumber(response.card_number)
                    setCreditCardName(response.card_name)
                    setCreditCardCVV(response.cvv)
                    setCreditCardExpiredDate(response.expiry_date)
                    //console.log("123",creditCardNumber,creditCardName,creditCardCVV,creditCardExpiredDate)
                    if(response.card_number !== undefined)
                        document.getElementById('Card_number').value = response.card_number
                    if(response.card_name !== undefined)
                        document.getElementById('Card_name').value = response.card_name
                }
            })
    }
    const UpdateCreditCard = () =>{
        if(localStorage.getItem("token")==='')
        {
          alert('You should login first')
          return
        }

        const data = {
            card_number: document.getElementById('Card_number').value,
            card_name: document.getElementById('Card_name').value,
            cvv: document.getElementById('cvv').value,
            expiry_date: document.getElementById('Expiry_date').value,
        }
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://localhost:5000/profile/credit_card',
          {
              method: 'POST',
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
                
              }
          })
      }
    const MakePayment = () =>{
        if(localStorage.getItem("token")==='')
        {
          alert('You should login first')
          return
        }
        const data = {
            card_number: document.getElementById('Card_number').value,
            cvv: document.getElementById('cvv').value,
            Expiry_date: document.getElementById('Expiry_date').value,
        }
        if(creditCardNumber === undefined || data.card_number != creditCardNumber)
            UpdateCreditCard()
        else
        {
            var card_name = document.getElementById('Card_name').value
            if(data.cvv !== creditCardCVV || data.Expiry_date !== creditCardExpiredDate || card_name !== creditCardName)
            {
                alert("Invalid card name, CVV or expiry date")
                return
            }
        }
        const headers = new Headers({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("token")
          });
          fetch('http://localhost:5000/bookings/pay/'+booking_id,
          {
              method: 'POST',
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
                console.log(response.error)
                // alert('Thanks for your payment')
                message.success("Thanks for your payment!")
                navigate(`/booking-page/${carspace_id}`)
              }
          })
      }

    useEffect(() => {
        GetCreditCard()
        GetCarSpace(carspace_id)
    },[])
    console.log(creditCardNumber,creditCardName,creditCardCVV,creditCardExpiredDate)
    return(
        <div>
            <Header/>
            <div className='information-box'>
                <div className='container-noborder'>
                    
                    <div className='all_center'>
                        <div>
                            <div>
                                <div>Address: {street}, {suburb} {state}, {postcode}</div>
                                <div>
                                    Date: {start_Date} - {end_Date}
                                </div>
                                <div>Price: {price} AUD/day</div>
                                <div>Width: {width}m</div>
                                <div>Length: {length}m</div>
                                <div>Total cost: {totalCost} AUD</div>
                                
                
                            </div>
                            <div className='all_center'>
                                <div id='fill_in_card'>
                                    <div className='all_center'>Card number</div>
                                    <input className="inputBlock" type="text" id="Card_number"/>
                                    <div className='all_center'>Card name</div>
                                    <input className="inputBlock" type="text" id="Card_name"/>
                                    <div className='all_center'>CVV</div>
                                    <input className="inputBlock" type="text" id="cvv"/>
                                    <div className='all_center'>Expire date</div>
                                    <input className="inputBlock" type="text" id="Expiry_date"/>
                                    <div className='all_center'>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className='all_center'>
                                <Button onClick={()=>MakePayment()} type="primary">Pay</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}