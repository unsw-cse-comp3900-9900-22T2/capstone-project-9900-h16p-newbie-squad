import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import Header from './Header';
import { Button, Divider } from 'antd';
import './login&signup.css'

export default function BookingPage() {
    const {booking_id} = useParams()
    console.log(booking_id)
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
                    if(response.card_number.length>0)
                        document.getElementById('Card_number').value = response.card_number
                    if(response.card_name>0)
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
            expiry_date: document.getElementById('Expire_date').value,
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
        UpdateCreditCard()
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
                console.log(response.error)
                alert('Thanks for your payment')
              }
          })
      }

    useEffect(() => {
        GetCreditCard()
    },[])
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
                                <div className='all_center'>Card name</div>
                                <input className="inputBlock" type="text" id="Card_name"/>
                                <div className='all_center'>CVV</div>
                                <input className="inputBlock" type="text" id="cvv"/>
                                <div className='all_center'>Expire date</div>
                                <input className="inputBlock" type="text" id="Expire_date"/>
                                <div className='all_center'>
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