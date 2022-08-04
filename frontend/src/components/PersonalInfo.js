import React, { useState } from 'react'
import Header from './Header'
import CarManagementPage from './CarManagementPage'
import CarSpacePage from './CarSpacePage'
import BookingHistoryPage from './BookingHistoryPage'
// import ListingPage from './ListingPage'
import ProfilePage from './ProfilePage'
import BillingHistoryPage from './BillingHistoryPage'
import RentRequest from './RentRequest'

export default function PersonalInfo() {
    const [carSpaceSelected, setCarSpaceSelected] = useState(false)
    const [carManagementSelected, setCarManagementSelected] = useState(false)
    const [profileSelected, setProfileSelected] = useState(false)
    const [bookingSelected, setBookingSelected] = useState(false)
    const [billingSelected, setBillingSelected] = useState(false)
    const [rentingSelected, setRentingSelected] = useState(false)
    const carSpaceClick = () => {
        setCarSpaceSelected(true)
        setCarManagementSelected(false)
        setProfileSelected(false)
        setBookingSelected(false)
        setBillingSelected(false)
        setRentingSelected(false)
    }
    const carManagementClick = () => {
        setCarManagementSelected(true)
        setCarSpaceSelected(false)
        setProfileSelected(false)
        setBookingSelected(false)
        setBillingSelected(false)
        setRentingSelected(false)
    }
    const profileClick = () => {
        setProfileSelected(true)
        setCarManagementSelected(false)
        setCarSpaceSelected(false)
        setBookingSelected(false)
        setBillingSelected(false)
        setRentingSelected(false)
    }
    const bookingClick = () => {
        setBookingSelected(true)
        setProfileSelected(false)
        setCarManagementSelected(false)
        setCarSpaceSelected(false)
        setBillingSelected(false)
        setRentingSelected(false)
    }
    const billingClick = () => {
        setBillingSelected(true)
        setBookingSelected(false)
        setProfileSelected(false)
        setCarManagementSelected(false)
        setCarSpaceSelected(false)
        setRentingSelected(false)
    }
    const rentingClick = () => {
        setBillingSelected(false)
        setBookingSelected(false)
        setProfileSelected(false)
        setCarManagementSelected(false)
        setCarSpaceSelected(false)
        setRentingSelected(true)
    }
  return (
    <div>
        <Header/>
        <div className='information-box'>
            <div className='container'>
                <div className='flex-item left-nav'>
                    <div className='flex-item pernal-item' onClick={carSpaceClick}>Listing</div>
                    <div className='flex-item pernal-item' onClick={rentingClick}>Rent Request</div>
                    <div className='flex-item pernal-item' onClick={carManagementClick}>Car Management</div>
                    <div className='flex-item pernal-item' onClick={profileClick}>Profile</div>
                    <div className='flex-item pernal-item' onClick={bookingClick}>Booking</div>
                    
                    <div className='flex-item pernal-item' onClick={billingClick}>Billing</div>
                </div>
                <div className='flex-item right-nav'>
                    {carSpaceSelected && <CarSpacePage/>}
                    {carManagementSelected && <CarManagementPage/>}
                    {profileSelected && <ProfilePage/>}
                    {bookingSelected && <BookingHistoryPage/>}
                    {billingSelected && <BillingHistoryPage/>}
                    {rentingSelected && <RentRequest/>}
                </div>
            </div>
        </div>
    </div>
  )
}
