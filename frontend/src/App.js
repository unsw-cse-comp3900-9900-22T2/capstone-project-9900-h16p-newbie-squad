// import logo from './logo.svg';
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import './components/HomePage.css'
import { useLoadScript } from "@react-google-maps/api"
import HomeSearch from './components/HomeSearch';
// import 'antd/dist/antd.css'

function App() {
  const API_KEY = "AIzaSyAbfa2MxLDynGC2ugXgwbXKwaxVIEbEsHk"
  // const libraries = ["places"]
  const [ libraries ] = useState(['places']);
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries
  })
  return (
    <>
      <Header/>
      <div className='information-box'>
          <div className='container-home-page'>
            <HomeSearch/>
          </div>
      </div>
    </>
  );
}

export default App;
