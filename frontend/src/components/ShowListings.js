import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider';
import ListingCard from './ListingCard';
import PriceMode from './PriceMode';
import Button from '@mui/material/Button';
import PriceRangePage from './PriceRangePage';
import DateRangePage from './DateRangePage'
import PriceSort from './PriceSort';

export default function ShowListings({ listings, searchedAddress, setPriceMode, priceMode, setPriceRange, priceRange, setDateRange, dateRange, setSelected, setListings, AllListings }) {
    // const [newListings, setNewListings] = useState([])
    const currentSuburb = searchedAddress.split(",")[1]
    // useEffect(() => {
    //     setNewListings(listings.filter(listing => {
    //         return currentSuburb?.toUpperCase().includes(listing.suburb.toUpperCase())
    //             && (listing.price >= priceRange[0] && listing.price <= priceRange[1])
    //             && (listing.availibility[0].start_date <= dateRange[0] && listing.availibility[0].end_date >= dateRange[1])
    //     }))
    // }, [listings])

    const newListings = listings.filter(listing => {
        return currentSuburb?.toUpperCase().includes(listing.suburb.toUpperCase())
            && (listing.price >= priceRange[0] && listing.price <= priceRange[1])
            && (listing.availibility[0].start_date <= dateRange[0] && listing.availibility[0].end_date >= dateRange[1])
    })

    const [showPriceRangePage, setShowPriceRangePage] = useState(false)
    const [showDateRangePage, setShowDateRangePage] = useState(false)

    const resetOnclick = () => {
        setPriceRange([0,100])
        setDateRange(["2099-12-31", "2000-01-01"])
        AllListings()
    }

    const PriceLowToHigh = () => {
        setListings([...listings].sort((a,b) => {
            return a.price - b.price
        }))
        // console.log(listings);
    }
    
  return (
    <div>
        {showPriceRangePage && 
            <PriceRangePage
                setShowPriceRangePage={setShowPriceRangePage}
                setPriceRange={setPriceRange}
                priceRange={priceRange}
                priceMode={priceMode}
            />
        }
        {showDateRangePage && 
            <DateRangePage
                setShowDateRangePage={setShowDateRangePage}
                setDateRange={setDateRange}
            />    
        }
        <div className='filter-section'>
            <Button 
                variant="outlined" 
                size='small'
                style={{fontSize: 10}}
                className="price-button"
                onClick={() => setShowPriceRangePage(true)}
            >price
            </Button>
            <Button 
                variant="outlined" 
                size='small'
                style={{fontSize: 10}}
                className="availability-button"
                onClick={() => setShowDateRangePage(true)}
            >Availability
            </Button>
            {/* <button>Availability</button> */}
            <PriceMode setPriceMode={setPriceMode} priceMode={priceMode}/>
            {/* <button onClick={resetOnclick}>reset</button> */}
            <div className='reset' onClick={resetOnclick}>Reset</div>
            {/* <div className='price-sort' onClick={PriceLowToHigh}>sort Price</div> */}
            <PriceSort listings={listings} setListings={setListings}/>
        </div>
        <Divider variant="middle"/>
        {newListings.map((listing, index) => (
            <div key={index} className="listing-card-container" >
                <ListingCard listing={listing} priceMode={priceMode} setSelected={setSelected}/>
            </div>
        ))}
    </div>
  )
}
