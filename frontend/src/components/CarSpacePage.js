import React, { useState, useEffect } from 'react'
import ParkingPopup from './ParkingPopup';
import ParkingSpaceDisplay from './ParkingSpaceDisplay';
import { useLoadScript } from "@react-google-maps/api";
import { Divider } from 'antd';
import "./CarSpacePage.css"



// const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function CarSpacePage() {
  const token = localStorage.getItem("token")
  const [carSpaceInformation, setCarSpaceInformation] = useState([])
  const [publishFormSelected, setPublishFormSelected] = useState(false)

  const API_KEY = "AIzaSyAbfa2MxLDynGC2ugXgwbXKwaxVIEbEsHk"
  const [ libraries ] = useState(['places']);
  const {isLoaded, loadError} = useLoadScript({
      // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      googleMapsApiKey: API_KEY,
      libraries,
  })
  const getAllListings = () => {
    const requestOption = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
    }
    fetch("http://127.0.0.1:5000/myparkingspace", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      console.log(data)
      setCarSpaceInformation([...data.all_parkingspaces])
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all of my car spaces");
    getAllListings()
  }, [])

  return (
    <div>
      <div className='release-button'>
        <ParkingPopup getAllListings={getAllListings}/>
      </div>
      <Divider>All resigered parking spaces</Divider>
      <ParkingSpaceDisplay 
        carSpaceInformation={carSpaceInformation}
        setPublishFormSelected={setPublishFormSelected}
        getAllListings={getAllListings}
      />
    </div>
  )
}
