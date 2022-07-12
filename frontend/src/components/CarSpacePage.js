import React, { useState, useEffect } from 'react'
import CarSpaceForm from './CarSpaceForm'
import PublishForm from './PublishForm'
import CarSpaceEditForm from './CarSpaceEditForm'


// const token = "4.UJsETXTotkCToYT7_SdxwOMYBMo"

export default function CarSpacePage() {
  const token = localStorage.getItem("token")
  const [carSpaceSelected, setCarSpaceSelected] = useState(false)
  const [carSpaceInformation, setCarSpaceInformation] = useState([])
  const [publishFormSelected, setPublishFormSelected] = useState(false)
  const [editFormSelected, setEditFormSelected] = useState(false)
  const [carSpaceId, setCarSpaceId] = useState(0)

  const leaseCarSpace = () => {
    setCarSpaceSelected(true)
  }

  const openEditForm = () => {
    setEditFormSelected(true)
  }
  const getAllListings = () => {
    const requestOption = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
    }
    fetch("http://127.0.0.1:5000/myparkingspace", requestOption)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      console.log(data)
      setCarSpaceInformation([...data.all_parkingspaces])
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    console.log("I need to fetch backend to get all of my car spaces");
    getAllListings()
  }, [])
  
  const unpublish = (space_id) => {
    const requestOption = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
    }
    fetch(`http://127.0.0.1:5000/myparkingspace/unpublish/${space_id}`, requestOption)
    .then(res => {
        if (res.status === 200) {
            getAllListings()
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => console.log(error))
  }


  return (
    <div>
      <button onClick={leaseCarSpace}>Lease my car space</button>
      {carSpaceSelected && <CarSpaceForm 
        setCarSpaceSelected={setCarSpaceSelected}
        setCarSpaceInformation={setCarSpaceInformation}
        getAllListings={getAllListings}
      />}

      {publishFormSelected && <PublishForm 
        setPublishFormSelected={setPublishFormSelected}
        carSpaceId={carSpaceId}
        getAllListings={getAllListings}
      />}

      {editFormSelected && 
        <CarSpaceEditForm 
          carSpaceInformation={carSpaceInformation}
          carSpaceId={carSpaceId}
          setEditFormSelected={setEditFormSelected}
        />
      }

      {carSpaceInformation.map((space, index) => (
        <div key={index}>
          Street at: {space.street},   Price: {space.price}, start: {space.start_date}, end: {space.end_date}
          {space.start_date === "Not published" && <button onClick={() => {
            setPublishFormSelected(true)
            setCarSpaceId(space.id)
          }}>
            publish
          </button>}

          {space.start_date !== "Not published" && 
            <button onClick={() => unpublish(space.id)}>unpublish</button>
          }

          {/* <button onClick={() => {
            openEditForm()
            setCarSpaceId(space.id)
          }}>Edit</button>           */}

        </div>
      ))}
    </div>
  )
}
