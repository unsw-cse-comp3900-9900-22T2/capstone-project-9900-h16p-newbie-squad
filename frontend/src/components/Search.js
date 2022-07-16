import React from 'react'
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

export default function Search({ panTo, setTempMarker, setDestination, address}) {
    const API_KEY = "AIzaSyCBM5x-xql7TePUP3oHu73CQXJaMmB80fw"
    const libraries = ["places"]
    const {isLoaded, loadError} = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: API_KEY,
        libraries,
    })
    
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
                clearSuggestions()
                try {
                    const results = await getGeocode({address})
                    const {lat, lng} = await getLatLng(results[0])
                    // console.log(lat, lng)
                    panTo({lat: lat, lng: lng})
                    setTempMarker({lat, lng})
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
