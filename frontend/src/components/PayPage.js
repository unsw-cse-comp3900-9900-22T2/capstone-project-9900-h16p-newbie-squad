import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import Header from './Header';
import './login&signup.css'

export default function BookingPage() {
    const {booking_id} = useParams()
    console.log(booking_id)

    const MakePayment = () =>{
        if(localStorage.getItem("token")==='')
        {
          alert('You should login first')
          return
        }

        const data = {
            card_number: document.getElementById('Card_number').value,
            cvv: document.getElementById('cvv').value,
            expire_date: document.getElementById('Expire_date').value,
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
                console.log(response)
                alert('Thanks for your payment')
                
              }
          })
      }
    return(
        <div>
            <Header/>
            <div className='information-box'>
                <div className='container-noborder'>
                    <div className='all_center'>
                        <div>
                            <div id='fill_in_card'>
                                <div className='all_center'>Card number</div>
                                
                                <input className="inputBlock" type="text" id="Card_number"/>
                                <div className='all_center'>CVV</div>
                                <input className="inputBlock" type="text" id="cvv"/>
                                <div className='all_center'>Expire date</div>
                                <input className="inputBlock" type="text" id="Expire_date"/>
                                <div className='all_center'>
                                    <input type='checkbox' id='save_card_number'/>
                                    Remember this card
                                </div>
                            </div>
                            <div className='all_center'>
                                <button onClick={()=>MakePayment()} className='pay-button'>Pay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}