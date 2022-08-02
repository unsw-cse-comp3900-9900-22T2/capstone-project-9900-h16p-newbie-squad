import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider';
import ListingCard from './ListingCard';
import PriceMode from './PriceMode';
import Button from '@mui/material/Button';
import PriceRangePage from './PriceRangePage';
import DateRangePage from './DateRangePage'
import PriceSort from './PriceSort';

export default function ShowListings({ listings, searchedAddress, setPriceMode, priceMode, setPriceRange, priceRange, setDateRange, dateRange, setSelected, setListings, AllListings }) {
    const currentSuburb = searchedAddress.split(",")[1]

    //for each listing period range, check if it is within the range that user picked
    const checkAvailability = (listing) => {
        for (const period of listing.availibility) {
            if (period.start_date <= dateRange[0] && period.end_date >= dateRange[1]) {
                return true
            }
        }
        return false
    }
    const newListings = listings.filter(listing => {
        return currentSuburb?.toUpperCase().includes(listing.suburb.toUpperCase())
            && (listing.price >= priceRange[0] && listing.price <= priceRange[1])
            && checkAvailability(listing)
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
            <PriceMode setPriceMode={setPriceMode} priceMode={priceMode}/>
            <div className='reset' onClick={resetOnclick}>Reset</div>
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
