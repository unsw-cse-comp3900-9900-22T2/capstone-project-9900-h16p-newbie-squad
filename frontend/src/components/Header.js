import React from 'react';
import { Outlet, Link } from "react-router-dom";

export default function Header() {
  return (
    <div className='header'>
      <div className='go-back-home'>
        <Link to="/"> <button>home-page</button></Link>
      </div>
      <div className='my-account'>
        <Link to="/personal-info"> <button>My account</button></Link>
        <Outlet />
      </div>
    </div>
  )
}

