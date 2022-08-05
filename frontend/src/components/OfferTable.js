import { Button, Checkbox, Form, Input, InputNumber, Upload, Divider } from 'antd';
import { DatePicker, Space } from 'antd';
import React, {useState, useEffect} from 'react';
import './OfferCard.css'


export default function OfferTable({setIsModalVisible, getAllListings, record}) {
  
  const token = localStorage.getItem("token")
  const [carSpaceInformation, setCarSpaceInformation] = useState([])
  const [isaccept, setIsaccept] = useState(false)

  
  const props = {
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const getAllList = () => {
    const requestOption = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
    }
    fetch(`http://127.0.0.1:5000/myrequest/myoffer/my_reveived_offers/${record.id}`, requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      console.log('accept',data["received offers"])
      data["received offers"].map((accept_item) => {
        console.log(accept_item.accept,true)
        if(accept_item.accept == true)
        {
          console.log('??acc')
          setIsaccept(true)
        }
      })
      setCarSpaceInformation([...data["received offers"]])
      
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all of my car spaces");
    getAllList()
  }, [])

  const submitAccept = (id) => {
    //   const data = {
    //     "owner_id": id
    // }
    const requestOption = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        // body: JSON.stringify(data)
    }
    fetch(`http://127.0.0.1:5000/myrequest/myoffer/accept_offer/${id}`, requestOption)
    .then(res => {
        if (res.status === 200) {
            getAllList()
            return res.json()
        } else {
            alert('Accept Error,need to update payment details in profile')
            // throw(error)
        }
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
  }




  return (
    <>
    {carSpaceInformation.map((listing, index) => (
            <div key={index} className="offercarditems">
                <div className='offerLeft'>
                  <div>
                    User: {listing.owner_name}
                  </div>
                  <div>
                    Address: {listing.street} {listing.suburb} {listing.state} , {listing.postcode}
                  </div>
                  <div>
                    Price: {listing.price}
                  </div>
                  <div>
                    Comments: {listing.comments}
                  </div>
                </div>
                <div className='offerRight'>
                  {
                    listing.accept &&
                    <Button disabled>Accepted</Button>
                  }
                  {
                    !listing.accept && !isaccept &&
                    <Button type="primary" onClick={()=>{submitAccept(listing.id)}}>Accept</Button>
                  }
                  
                </div>
            </div>
        ))}
    </>
  );
};