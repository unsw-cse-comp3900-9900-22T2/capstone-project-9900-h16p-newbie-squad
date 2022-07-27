import React, { useState } from 'react'
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import "./HomePage.css"
import './MapAndListingPage.css'

export default function Search({ panTo, setTempMarker, setDestination, address, setListings, listings, setSearchedAddress, AllListings }) {
    const API_KEY = "AIzaSyCBM5x-xql7TePUP3oHu73CQXJaMmB80fw"
    const [ libraries ] = useState(['places']);
    const {isLoaded, loadError} = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: API_KEY,
        libraries,
    })
    const filterListingBySearch = (address) => {
        const currentSuburb = address.split(", ")[1].split(' ')[0]
        console.log(currentSuburb);
        const newListings = listings.filter(listing => listing.suburb.toUpperCase() === currentSuburb.toUpperCase())
        newListings.map(listing => console.log(`${listing.street}, ${listing.suburb}`))
        setListings(newListings)
    }
    
    const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => -33.917347,
                lng: () => 151.231262
            },
            radius: 200 * 1000, 
        }
    })

    return (
        <div className='search-map'>
            <Combobox onSelect={async(address) => {
                setValue(address, false)
                setDestination(address)
                setSearchedAddress(address)
                clearSuggestions()
                try {
                    const results = await getGeocode({address})
                    const {lat, lng} = await getLatLng(results[0])
                    // console.log(lat, lng)
                    // filterListingBySearch(address)
                    panTo({lat: lat, lng: lng})
                    setTempMarker({lat, lng})
                    AllListings()
                } catch(error) {
                    console.log(error);
                }
                // console.log(address)
            }}>
                <ComboboxInput
                    value={value} 
                    onChange={e => setValue(e.target.value)}
                    disabled={!ready}
                    placeholder="Enter an address"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && data.map(({id, description}, index) => (
                            <ComboboxOption key={index} value={description}/>
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}
