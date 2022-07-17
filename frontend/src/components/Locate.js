import React from 'react'

export default function Locate({ panTo, setTempMarker }) {
  return (
    <button className='locate' onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
            // console.log(position);
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            setTempMarker({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        }, () => null)
    }}>
        <img src='compass.svg' alt='locate me'/>
    </button>
  )
}
