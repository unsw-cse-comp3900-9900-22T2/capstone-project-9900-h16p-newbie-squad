import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import './HomePage.css'
import './../App.css';
import {Button, Input} from "antd"
import AdminDisplay from './AdminDisplay';



export default function HomeSearch() {
    const [address, setAddress] = useState("")
    const navigate = useNavigate();

    const updateInput = (e) => {
        setAddress(e.target.value);
    }
    const goToMap = () => {
        // navigate('/MapAndListing-page',{state:{address: address}});
        localStorage.setItem("address", address)
    }

  return (
    <div className='home_page'>
        {localStorage.getItem("username") !== "Admin" && 
        <div className='container-noborder'>
            <div className="search_input" >
                <Input 
                    className="search_input" 
                    type="text" 
                    id="search_input" 
                    onChange={updateInput}
                    placeholder="eg. 850 Bourke street, Waterloo NSW, 2017"
                />
            </div>
            <Link to="/MapAndListing-page">
                <Button onClick={goToMap} type="primary">Search</Button>
            </Link>
        </div>}
        {localStorage.getItem("username") === "Admin" &&
            <div className='admin-home-page'>
                {/* <div className='sample'>hello</div>
                <div className='sample'>hello</div>
                <div className='sample'>hello</div>
                <div className='sample'>hello</div>
                <div className='sample'>hello</div> */}
                <AdminDisplay />
            </div>
        }
    </div>
  )
}
