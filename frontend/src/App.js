// import logo from './logo.svg';
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import './components/HomePage.css'
// import Search from './components/Search';
import { useLoadScript } from "@react-google-maps/api"
import HomeSearch from './components/HomeSearch';


function App() {
  const API_KEY = "AIzaSyCBM5x-xql7TePUP3oHu73CQXJaMmB80fw"
  // const libraries = ["places"]
  const [ libraries ] = useState(['places']);
  const {isLoaded, loadError} = useLoadScript({
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: API_KEY,
    libraries
  })
  return (
    <>
      <Header/>
      <div className='information-box'>
          <div className='container-noborder'>
            <HomeSearch/>
          </div>
      </div>
    </>
  );
}

export default App;
