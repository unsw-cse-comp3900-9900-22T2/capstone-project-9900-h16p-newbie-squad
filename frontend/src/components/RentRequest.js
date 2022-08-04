import React, { useState } from 'react'
import { useEffect } from 'react'
import RentPopup from './RentPopup.js'
import { useLoadScript } from "@react-google-maps/api";
import { Divider } from 'antd';
import RentingDisplay from './RentingDisplay';
import "./CarSpacePage.css"

export default function RentRequest() {
    const token = localStorage.getItem("token")
  const [carSpaceInformation, setCarSpaceInformation] = useState([])
  const [publishFormSelected, setPublishFormSelected] = useState(false)

  const API_KEY = "AIzaSyCBM5x-xql7TePUP3oHu73CQXJaMmB80fw"
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
    fetch("http://127.0.0.1:5000/myrequest", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      console.log(data)
      setCarSpaceInformation([...data.all_requests])
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
        <RentPopup getAllListings={getAllListings}/>
      </div>
      <Divider>All requested parking spaces</Divider>
      <RentingDisplay 
        carSpaceInformation={carSpaceInformation}
        setPublishFormSelected={setPublishFormSelected}
        getAllListings={getAllListings}
      />
    </div>
  )
}
