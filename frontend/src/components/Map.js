import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import MapStyle from './MapStyle'
import Search from './Search'
import './MapAndListingPage.css'

const google = window.google
const API_KEY = "AIzaSyCBM5x-xql7TePUP3oHu73CQXJaMmB80fw"
// const libraries = ["places"]

const mapContainerStyle = {
    width: "100vw",
    height: "100vh"
  }
  const center = {
    lat: -33.917347,
    lng: 151.231262
  }
  
  const options = {
    styles: MapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google?.maps.ControlPosition.LEFT_CENTER,
    },
  }

export default function Map({ listings, address }) {
    // console.log("first address: ", address);
    const [ libraries ] = useState(['places']);
    const {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: API_KEY,
      libraries
    })
    const [selected, setSelected] = useState(null)
    const [tempMarker, setTempMarker] = useState(null)
    const [destination, setDestination] = useState('')
    const [distance, setDistance] = useState('')

    const mapRef = useRef()
    const onMapLoad = useCallback(map =>{
      mapRef.current = map
    }, [])

    const panTo = useCallback(({lat, lng}) => {
      mapRef.current.panTo({lat, lng})
      mapRef.current.setZoom(14)
    }, [])

    const fetchDistance = (origin, destination) => {
      const google = window.google;
      const service = new google.maps.DirectionsService()
      service.route({
        origin: origin,
        destination: destination,
        travelMode: "DRIVING"
      },
      (result, status) => {
        if (status === "OK") {
            const dist = result.routes[0].legs[0].distance.text
            console.log(dist);
            setDistance(dist)
        }
      })
    }

    const markerOnclick = (listing) => {
      const origin = listing.street + ", " + listing.suburb + " " + listing.state + ", " + listing.postcode
      fetchDistance(origin, destination)
      setSelected(listing)
    }

    const getLocation = async (address) => {
      try {
          const results = await getGeocode({address})
          const {lat, lng} = await getLatLng(results[0])
          return {lat, lng}
      } catch(error) {
          console.log(error);
      }  
    }
    
    useEffect(() => {
      if (address) {
        getLocation(address).then(data => {
          if (data) {
            setTempMarker(data)
            panTo(data)
          }
        })
      }
      setDestination(address)
    }, [])

    if (loadError) return "Error loading maps"
    if (!isLoaded) return "loading..."

    return (
    <div className='map-container'>
      <Search panTo={panTo} setTempMarker={setTempMarker} setDestination={setDestination} address={address}/>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={(e) => console.log(e.latLng.lat(),e.latLng.lng())}
        onLoad={onMapLoad}
      >
        {listings.map((listing, index) => 
          <Marker
            key={index} 
            position={{lat: parseFloat(listing.latitude), lng: parseFloat(listing.longitude)}}  
            icon={{
              url: "parking-1.svg",
              scaledSize: new window.google.maps.Size(20, 20),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(10, 10),
            }}
            onClick={() => markerOnclick(listing)}
          />
        )}
        {tempMarker ? <Marker position={{lat: tempMarker.lat, lng: tempMarker.lng}} /> : null}
        {selected ?
          (<InfoWindow position={{lat: parseFloat(selected.latitude), lng: parseFloat(selected.longitude)}} onCloseClick={() => {
            setSelected(null)
            setDistance('')
            }}>
            <div>
              <h3>hello</h3>
              {distance && <div>{distance}</div>}
            </div>
          </InfoWindow>) 
        : null}  
      </GoogleMap>
    </div>
  )
}
