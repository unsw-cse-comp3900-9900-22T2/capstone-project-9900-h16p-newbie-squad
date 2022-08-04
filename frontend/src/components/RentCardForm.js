import { Button, Checkbox, Form, Input, InputNumber, Upload, Divider } from 'antd';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import React, {useState} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { convertBase64 } from '../util/function';
import './RentCardForm.css'
import OfferTable from './OfferTable'
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;


export default function RentCardForm({setIsModalVisible, getAllListings, record}) {
  
  const token = localStorage.getItem("token")
  const address = record.street + ", " + record.suburb + " " + record.state + ", " + record.postcode
  console.log(address);

  // const upLoadImage = async(e) => {
  //   const file = e.target.files[0]
  //   const base64 = await convertBase64(file)
  //   console.log(base64);
  //   setBaseImage(base64)
  // }
  const props = {
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  




  return (
    <>
    <div className='TopContents'>
        <div className='TopContentLeft'>
            <div>
                User: {record.owner}
            </div>
            <div className='RequestDetail'>
                Request Details
            </div>
        </div>
        <div className='TopContentRight'>
            <div>
                Budget:
            </div>
            <div>
                ${record.budget}/day
            </div>
        </div>
    </div>
    <div className='BottomContents'>
        <div>
            Location:  {address}
        </div>
        <div>
            Rent Period: {record.start_date} to {record.end_date}
        </div>
        <div className='otherContents'>
            <div className='otherLeft'>Other requirement: </div>
            <div>{record.others}</div>
        </div>
    </div>
    <Divider></Divider>
    <div>OFFERS:</div>
    <OfferTable record={record}></OfferTable>
    </>
  );
};