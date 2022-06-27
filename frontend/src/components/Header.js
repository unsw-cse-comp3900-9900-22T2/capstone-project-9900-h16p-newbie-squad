import React from 'react';
import { Outlet, Link } from "react-router-dom";

export default function Header() {
  return (
    <div className='header'>
      <div className='go-back-home'>
        <Link to="/"> home-page</Link>
      </div>
      <div className='my-account'>
        <Link to="/personal-info"> My account</Link>
        {/* <Outlet /> */}
      </div>
    </div>
  )
}

