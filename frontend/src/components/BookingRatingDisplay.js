import { Button, Divider, Popconfirm } from 'antd';
import React, {useEffect} from 'react';
import {useLocation, useParams, Link} from 'react-router-dom';
import './BookingPage.css'

const BookingRatingDisplay = ({BookingRating, GetAllComment}) => {
    
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const DeleteReview = (review_id) => {
        console.log(review_id)
        console.log(token)
        console.log(username)
        const requestOption = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
          }
          fetch(`http://127.0.0.1:5000/reviews/my_reviews/${review_id}`, requestOption)
          .then(res => {
              if (res.status === 200) {
                // location.reload()
                  return
              } else {
                  throw(res)
              }
          })
          .then(data => {
              console.log(data)
              GetAllComment()
          })
          .catch(error => console.log(error))
    }
    const IntToStar = (e) => {
        let stars = '★'
        for(let i=2;i<=5;i++)
            if(e>=i)
            stars+='★'
            else
            stars+='☆'
        return stars
    }
    const dataList = []
    for(let index = BookingRating.length - 1; index >= 0; index--)
    {
        dataList.push({
            reviewer: BookingRating[index].reviewer,
            review_id: BookingRating[index].review_id,
            review_rating: BookingRating[index].review_rating,
            review_made_time: BookingRating[index].review_made_time,
            review_text: BookingRating[index].review_text,
            review_stars: IntToStar(BookingRating[index].review_rating),
        })
    }
    const onConfirm = (review) => {
        DeleteReview(review.review_id)
    }
    return (
        <div>
            {dataList.map((review, index) => (
                
            <div key={index}>
                <div>Poster: {review.reviewer}</div>
                <div>Rating: {review.review_rating}  {review.review_stars}</div>
                <div>Posted at: {review.review_made_time}</div>
                <div>Comment:</div>
                <div>{review.review_text}</div>
                {username == review.reviewer &&
                 <Popconfirm
                 title="Are you sure?"
                 onConfirm={() => onConfirm(review)}
                 okText="Yes"
                 cancelText="No"
               >
                 <Button>Delete</Button>
               </Popconfirm> 
                }
                <Divider></Divider>
            </div>
        ))}
        </div>
    )
}

export default BookingRatingDisplay;