import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import './HomePage.css'
import './../App.css';



export default function HomeSearch() {
    const [address, setAddress] = useState("")
    const navigate = useNavigate();

    const updateInput = (e) => {
        setAddress(e.target.value);
    }
    const goToMap = () => {
        navigate('/MapAndListing-page',{state:{address: address}});
    }

  return (
    <div className='home_page'>
        <input 
            className="search_input" 
            type="text" 
            id="search_input" 
            onChange={updateInput}
        />
        {/* <Link to="/MapAndListing-page"> */}
            <button className="button_40px" onClick={goToMap}>Search</button>
        {/* </Link> */}
    </div>
  )
}
