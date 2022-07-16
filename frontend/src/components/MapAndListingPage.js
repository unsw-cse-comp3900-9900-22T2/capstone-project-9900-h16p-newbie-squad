import React, { useState, useEffect } from 'react'
import Header from './Header'
import Map from './Map'
import {useLocation} from 'react-router-dom';

export default function MapAndListingPage() {
    const token = localStorage.getItem("token")
    const [listings, setListings] = useState([])
    const location = useLocation()
    const address = location.state.address
    const AllListings = () => {
        const requestOption = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("http://127.0.0.1:5000/listings", requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data)
            setListings(data.all_listings)
        })
        .catch(error => console.log(error))
    }
    useEffect(() => {
        AllListings()
    },[])
  return (
    <div>
        <Header/>
        <div className='information-box'>
            <div className='container'>
                <div className='flex-item left-nav'>
                    left
                </div>
                <div className='flex-item right-nav'>
                    <Map listings={listings} address={address}/>
                </div>
            </div>
        </div>
    </div>
  )
}
