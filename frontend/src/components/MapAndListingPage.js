import React, { useState, useEffect } from 'react'
import Header from './Header'
import Map from './Map'
import {useLocation} from 'react-router-dom';
import ShowListings from './ShowListings';

export default function MapAndListingPage() {
    const token = localStorage.getItem("token")
    const [listings, setListings] = useState([])
    const address = localStorage.getItem("address")
    const [searchedAddress, setSearchedAddress] = useState(address)
    const [priceMode, setPriceMode] = useState('day')
    const [priceRange, setPriceRange] = useState([0,100])
    const [dateRange, setDateRange] = useState(["2099-12-31", "2000-01-01"])
    const [selected, setSelected] = useState(null)

    const AllListings = () => {
        const requestOption = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("http://127.0.0.1:5000//available_parking_spaces", requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            setListings(data.available_parking_spaces)
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
            <div className='container-map-and-listing'>
                <div className='flex-item left-listings'>
                    <ShowListings
                        listings={listings}
                        searchedAddress={searchedAddress}
                        setPriceMode={setPriceMode}
                        priceMode={priceMode}
                        setPriceRange={setPriceRange}
                        priceRange={priceRange}
                        setDateRange={setDateRange}
                        dateRange={dateRange}
                        setSelected={setSelected}
                        setListings={setListings}
                        AllListings={AllListings}
                    />
                </div>
                <div className='flex-item right-map'>
                    <Map 
                        listings={listings} 
                        address={address} 
                        setListings={setListings}
                        setSearchedAddress={setSearchedAddress}
                        priceMode={priceMode}
                        priceRange={priceRange}
                        dateRange={dateRange}
                        selected={selected}
                        setSelected={setSelected}
                        AllListings={AllListings}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}
