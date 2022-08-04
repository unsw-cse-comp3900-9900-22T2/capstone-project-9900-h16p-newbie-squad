import { Button, Checkbox, Form, Input, InputNumber, Upload, Divider } from 'antd';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import React, {useState} from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { convertBase64 } from '../util/function';
import RentRightForm from './RentRightForm'
import './RentCardForm.css'
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;


export default function RentIndexForm({setIsModalVisible, getAllListings, selected}) {
  
  const token = localStorage.getItem("token")
  const address = selected.street + ", " + selected.suburb + " " + selected.state + ", " + selected.postcode
  console.log(address);
  const [isopen, setIsopen] = useState(false)

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
    <div className="RentFormAll">
    <div className='TopContents'>
        <div className='TopContentLeft'>
            <div>
                User: {selected.owner}
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
                ${selected.budget}/day
            </div>
        </div>
    </div>
    <div className='BottomContents'>
        <div>
            Location:  {address}
        </div>
        <div>
            Rent Period: {selected.start_date} to {selected.end_date}
        </div>
        <div className='otherContents'>
            <div className='otherLeft'>Other requirement: </div>
            <div>{selected.others}</div>
        </div>
    </div>
    {
        !isopen &&
        <Button onClick={()=>setIsopen(true)}>Make an offer</Button>
    }
    {
        isopen &&
        <RentRightForm id={selected.id} setIsopen={setIsopen} />
    }
    </div>
  );
};