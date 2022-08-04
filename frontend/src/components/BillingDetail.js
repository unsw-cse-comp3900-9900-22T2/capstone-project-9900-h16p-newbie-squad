import { jsx } from '@emotion/react';
import React, { useState, useEffect }from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';
import Header from './Header';
import './BillingDetail.css'

var booking_id=''
export default function BillingDetail() {
    // const listing = JSON.parse(localStorage.getItem("listing-book"))
    // console.log(listing);
    // 此处的listing是object，里面有所有关于该车位的信息的信息
    const {bill_id} = useParams()
    console.log(bill_id);
    const [providerid,setProviderid]=useState(null)
    const [customerid,setCustomerid]=useState(null)
    const [providername,setProvidername]=useState(null)
    const [customername,setCustomername]=useState(null)
    const [address,setAddress]=useState(null)
    const [startdate,setStartdate]=useState(null)
    const [enddate,setEnddate]=useState(null)
    const [unitprice,setUnitprice]=useState(null)
    const [totalprice,setTotalprice]=useState(null)
    const [paymenttime,setPaymenttime]=useState(null)
    const [rentfee,setRentfee]=useState(null)
    const [servicefee,setServicefee]=useState(null)
    const [customercardnumber,setCustomercardnumber]=useState(null)
    const [providercardnumber,setProvidercardnumber]=useState(null)

    const GetListing = (listing_id) =>{
        const headers = new Headers({
          'Content-Type': 'application/json',
          });
          
          fetch('http://localhost:5000/billing/'+listing_id,
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
                console.log('dakshbdjasbdjkhsabd')
                var listingData=response
                setRentfee(listingData.rent_fee)
                setServicefee(listingData.service_fee)
                setProviderid(listingData.provider_id)
                setCustomerid(listingData.customer_id)
                setProvidername(listingData.provider_name)
                setCustomername(listingData.customer_name)
                setAddress(listingData.address)
                setStartdate(listingData.start_date)
                setEnddate(listingData.end_date)
                setUnitprice(listingData.unit_price)
                setTotalprice(listingData.total_price)
                setPaymenttime(listingData.payment_time)
                setCustomercardnumber(listingData.customer_card_number)
                setProvidercardnumber(listingData.provider_bank_account)
              }
          })
      }

    useEffect(() => {
      GetListing(bill_id)
    },[])
    return (
      <div>
        <Header/>
        <div className='billingDetailMain'>
            <div className='billingDetailContent'>
                <div className='billingDetailAll'>
                    <h6>provider_name: {providername}</h6>
                    <h6>customer_name: {customername}</h6>
                    <h6>{address}</h6>
                    <h6>start_date: {startdate}</h6>
                    <h6>end_date: {enddate}</h6>
                    <h6>rent_fee: ${rentfee}</h6>
                    <h6>service_fee: ${servicefee}</h6>
                    <h6>total_price: ${totalprice}</h6>
                    <h6>payment_time: {paymenttime}</h6>
                </div>
            </div>
        </div>
      </div>
    )
}