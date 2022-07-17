import React, { useState } from 'react'
import Divider from '@mui/material/Divider';
import ListingCard from './ListingCard';
import PriceMode from './PriceMode';
import Button from '@mui/material/Button';
import PriceRangePage from './PriceRangePage';
import DateRangePage from './DateRangePage'


export default function ShowListings({ listings, searchedAddress, setPriceMode, priceMode }) {
    console.log(searchedAddress);
    const [priceRange, setPriceRange] = useState([0,100])
    const [dateRange, setDateRange] = useState(["2000-01-01", "2099-12-31"])
    const currentSuburb = searchedAddress.split(", ")[1]?.split(' ')[0]
    const newListings = listings.filter(listing => {
        // if (priceMode === 'day') {
        //     return listing.suburb.toUpperCase() === currentSuburb?.toUpperCase()
        //     && (listing.price >= priceRange[0] && listing.price <= priceRange[1])
        // }
        // return listing.suburb.toUpperCase() === currentSuburb?.toUpperCase()
        // && (listing.price * 28 >= priceRange[0] && listing.price * 28 <= priceRange[1])
        // console.log("current date: ", dateRange);
        return listing.suburb.toUpperCase() === currentSuburb?.toUpperCase()
            && (listing.price >= priceRange[0] && listing.price <= priceRange[1])
            && (listing.start_date >= dateRange[0] && listing.end_date <= dateRange[1])
    })

    const [showPriceRangePage, setShowPriceRangePage] = useState(false)
    const [showDateRangePage, setShowDateRangePage] = useState(false)
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
        </div>
        <Divider variant="middle"/>
        {newListings.map((listing, index) => (
            <div key={index} className="listing-card-container">
                <ListingCard listing={listing} priceMode={priceMode}/>
            </div>
        ))}
        
    </div>
  )
}
