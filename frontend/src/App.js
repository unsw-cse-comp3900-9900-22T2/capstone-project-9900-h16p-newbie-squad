// import logo from './logo.svg';
import React from 'react';
import './App.css';
import Header from './components/Header';
import './components/HomePage.css'

function App() {
  return (
    <>
      <Header/>
      <div className='information-box'>
          <div className='container-noborder'>
              <div className='home_page'>
                  <input className="search_input" type="text" id="search_input"/>
                  <button className="button_40px">Search</button>
                  <button className="button_40px">Filter</button>
              </div>
          </div>
      </div>
    </>
  );
}

export default App;
