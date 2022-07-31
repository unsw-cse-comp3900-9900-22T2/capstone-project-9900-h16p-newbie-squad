import { Button, Divider } from 'antd';
import React, {useEffect} from 'react';
import {useLocation, useParams, Link} from 'react-router-dom';
import './BookingPage.css'

const BookingRatingDisplay = ({BookingRating}) => {
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
            review_rating: BookingRating[index].review_rating,
            review_made_time: BookingRating[index].review_made_time,
            review_text: BookingRating[index].review_text,
            review_stars: IntToStar(BookingRating[index].review_rating),
        })
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
                <Button>Delete</Button>
                <Divider></Divider>
            </div>
        ))}
        </div>
    )
}

export default BookingRatingDisplay;