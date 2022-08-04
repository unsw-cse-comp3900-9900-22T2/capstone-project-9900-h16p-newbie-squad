import React, { useState, useEffect } from 'react'
import Header from './Header'
import Map from './Map'
import {useLocation} from 'react-router-dom';
import RentIndexForm from './RentIndexForm'
import ShowRentings from './ShowRentings';

export default function MapAndRenting() {
    const token = localStorage.getItem("token")
    console.log(token);
    const [listings, setListings] = useState([])
    // const location = useLocation()
    // const address = location.state.address
    const address = localStorage.getItem("address")
    const [searchedAddress, setSearchedAddress] = useState(address)
    const [priceMode, setPriceMode] = useState('day')
    const [priceRange, setPriceRange] = useState([0,100])
    const [dateRange, setDateRange] = useState(["2099-12-31", "2000-01-01"])
    const [selected, setSelected] = useState({})

    const AllListings = () => {
        const requestOption = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("http://127.0.0.1:5000/myrequest/published_requests", requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data.all_published_requests)
            setListings(data.all_published_requests)
        })
        .catch(error => console.log(error))
    }

    const changeSelect = (listing) => {
        console.log('woxuan',listing)
        setSelected(listing)
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
                    <ShowRentings
                        listings={listings}
                        AllListings={AllListings}
                        setSelected={changeSelect}
                    />
                </div>
                <div className='flex-item right-map rent-detail'>
                    {
                        selected.start_date &&
                        <RentIndexForm selected={selected}/>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
