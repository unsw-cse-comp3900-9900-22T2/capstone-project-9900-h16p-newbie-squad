import React from 'react'
import Paper from '@mui/material/Paper';
import {Button, message} from 'antd';
import BookingButton from './BookingButton';
import {Image} from "antd"
import base_64 from "./ba64_sample"
import AvailableDate from './AvailableDate';
import './MapRentingPage.css'
import { dividerClasses } from '@mui/material';
// import {Link, useNavigate} from 'react-router-dom';


export default function RentingCards({listing, priceMode, setSelected}) {
    console.log(listing);
    const token = localStorage.getItem("token")
    const priceMonthly = (price) => {
        return price * 28
    }
    // const navigate = useNavigate();
    // const bookOnclick = () => {
    //     navigate('/test',{state:{listing: listing}});
    // }
  return (
    <div className='RentLeftCards'> 
       <div className='RentLeftContent'> 
            <div>{listing.title}</div>
            <div>{listing.street}, {listing.suburb} {listing.state}, {listing.postcode}</div>
            <div>
                From: {listing.start_date} To: {listing.end_date}
            </div>
            <div></div>
        </div> 
        <div className='RentRightContent'> 
            <div>
            Budget: ${listing.budget}/day
            </div>
            <div onClick={()=>{setSelected(listing)}}>
                {
                    token && 
                    <Button size="small" type='primary'>Detail</Button>
                }
            </div>
        </div> 
    </div>
  )
}
