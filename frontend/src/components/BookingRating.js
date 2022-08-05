import { Button, Modal, Space, message } from 'antd';
import React, { useState } from 'react';
import './BookingPage.css'

const BookingRaing = ({record}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [myRating,setMyRating]=useState(3)
  let id1= 'rateStar1'+record.toString()
  let id2= 'rateStar2'+record.toString()
  let id3= 'rateStar3'+record.toString()
  let id4= 'rateStar4'+record.toString()
  let id5= 'rateStar5'+record.toString()
  let idtext= 'comment_box'+record.toString()
  //console.log(record);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const postComment = () =>{
    if(localStorage.getItem("token")==='')
    {
      alert('You should login first')
      return
    }
    const data = {
      review_text: document.getElementById(idtext).value,
      review_rating: myRating
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'token': localStorage.getItem("token")
      });
      //console.log(JSON.stringify(data))
      fetch('http://localhost:5000/reviews/my_reviews/new/'+record.toString(),
      {
          method: 'POST',
          body: JSON.stringify(data),
          headers: headers,
      })
      .then(res => res.json())
      .catch(error => {
          console.error('Error:', error)
      })
      .then(response => {
          if(response.error !== undefined)
          {
              alert(response.error)
              console.log(response.error)
          }
          else 
          {
            console.log(response)
            setIsModalVisible(false);
            message.success("Thanks for your rating")
          }
      })
  }

  const changeRating = (e) =>{
    setMyRating(e)
    if(e >= 2)
      document.getElementById(id2).innerText='★'
    else
      document.getElementById(id2).innerText='☆'

    if(e >= 3)
      document.getElementById(id3).innerText='★'
    else
      document.getElementById(id3).innerText='☆'

    if(e >= 4)
      document.getElementById(id4).innerText='★'
    else
      document.getElementById(id4).innerText='☆'

    if(e >= 5)
      document.getElementById(id5).innerText='★'
    else
      document.getElementById(id5).innerText='☆'
  }
  return (
    <>
      <Button  onClick={showModal}>
        Rating
      </Button>
      <Modal title="Booking Raing" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}> 
        <div>
            <textarea id={idtext} className='input-text' cols="80" name="msg" rows="5" placeholder="Leave your comment here"></textarea>
                <div>
                    <div>
                        <div className='all-center'>
                        <div className='rating-bar'>
                        <div>Rating:</div>
                        <div id={id1} className='rating-star' onClick={()=>changeRating(1)}>★</div>
                        <div id={id2} className='rating-star' onClick={()=>changeRating(2)}>★</div>
                        <div id={id3} className='rating-star' onClick={()=>changeRating(3)}>★</div>
                        <div id={id4} className='rating-star' onClick={()=>changeRating(4)}>☆</div>
                        <div id={id5} className='rating-star' onClick={()=>changeRating(5)}>☆</div>
                        <div>{myRating}</div>
                        </div>
                    </div>
                    <br/>
                    <div className='all-center'>
                    <Button type="primary" onClick={()=>postComment()} className='rect-button'>Post</Button>
                    </div>
                </div>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingRaing;