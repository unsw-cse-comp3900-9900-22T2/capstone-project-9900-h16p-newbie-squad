import React, { useState } from 'react'
import Header from './Header'
import CarManagementPage from './CarManagementPage'
import CarSpacePage from './CarSpacePage'
import ListingPage from './ListingPage'
import ProfilePage from './ProfilePage'

export default function PersonalInfo() {
    const [carSpaceSelected, setCarSpaceSelected] = useState(false)
    const [carManagementSelected, setCarManagementSelected] = useState(false)
    const [listingSelected, setListingSelected] = useState(false)
    const [profileSelected, setProfileSelected] = useState(false)
    const carSpaceClick = () => {
        setCarSpaceSelected(true)
        setCarManagementSelected(false)
        setListingSelected(false)
        setProfileSelected(false)
    }
    const carManagementClick = () => {
        setCarManagementSelected(true)
        setCarSpaceSelected(false)
        setListingSelected(false)
        setProfileSelected(false)
    }
    const listingtClick = () => {
        setListingSelected(true)
        setCarManagementSelected(false)
        setCarSpaceSelected(false)
        setProfileSelected(false)
    }
    const profileClick = () => {
        setProfileSelected(true)
        setListingSelected(false)
        setCarManagementSelected(false)
        setCarSpaceSelected(false)
    }
  return (
    <div>
        <Header/>
        <div className='information-box'>
            <div className='container'>
                <div className='flex-item left-nav'>
                    <div className='flex-item pernal-item' onClick={listingtClick}>Listings</div>
                    <div className='flex-item pernal-item' onClick={carSpaceClick}>Car Spaces</div>
                    <div className='flex-item pernal-item' onClick={carManagementClick}>Car Management</div>
                    <div className='flex-item pernal-item' onClick={profileClick}>Profile</div>
                    <div className='flex-item pernal-item'>Billing</div>
                </div>
                <div className='flex-item right-nav'>
                    {carSpaceSelected && <CarSpacePage/>}
                    {carManagementSelected && <CarManagementPage/>}
                    {listingSelected && <ListingPage/>}
                    {profileSelected && <ProfilePage/>}
                </div>
            </div>
        </div>
    </div>
  )
}
