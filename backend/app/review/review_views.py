from . import review_bp
from flask import request,g
from .. import db
from ..models import Booking, Status, Review, Parking_space




@review_bp.route("/reviews/parking_space_review/<int:parking_space_id>",methods=['GET'])
def get_reviews_of_a_parking_space(parking_space_id):
    target_parking_space=Parking_space.query.filter_by(id=parking_space_id).first()
    if target_parking_space==None: return {'error':'invalid input'},400
    result=[]
    for each_review in target_parking_space.reviews:
        result.append({
            'review_id':each_review.id,
            'reviewer':each_review.author.username,
            'review_text':each_review.review_text,
            'review_rating':each_review.review_rating,
            'review_made_time':each_review.review_made_time.strftime('%Y-%m-%d')
        })

    return {'reviews':result},200



@review_bp.route("/reviews/my_reviews/new/<int:booking_id>",methods=['POST'])
def create_new_review(booking_id):
    curr_user=g.curr_user

    target_booking=Booking.query.filter_by(id=booking_id).first()
    if target_booking==None:
        return {'error':'invalid input'},400
    if target_booking.customer!=curr_user:
        return {'error':'not your booking'},400
    if target_booking.status!=Status.Successful:
        return {'error':'this booking is not in Successful state, you cannot review it'},400
    target_parking_space=target_booking.parking_space

    request_data=request.get_json()
    review_text=request_data.get('review_text')
    review_rating=request_data.get('review_rating')

    if review_text==None or review_rating==None:
        return {'error':'invalid input'},400

    #update rating for the underlying parking space
    reviews_count=len(list(target_parking_space.reviews))
    if reviews_count==0:
        target_parking_space.average_rating=review_rating
    else:
        new_rating=(target_parking_space.average_rating*reviews_count+review_rating)/(reviews_count+1)
        target_parking_space.average_rating=new_rating

    try:
        #insert new review
        new_review=Review(author=curr_user,parking_space=target_parking_space,booking=target_booking,\
            review_text=review_text,review_rating=review_rating)
        db.session.add(new_review)
        db.session.add(target_parking_space)
        db.session.commit()
        new_review_id=Review.query.all()[-1].id
    except:
        return {'error':'db internal error'},400

    return {'new_review_id':new_review_id},200



@review_bp.route("/reviews/my_reviews/<int:booking_id>",methods=['GET'])
def get_my_review_of_a_booking(booking_id):
    curr_user=g.curr_user

    my_review=Review.query.filter_by(author=curr_user,booking_id=booking_id).first()

    result=None if my_review==None else {
        'review_id':my_review.id,
        'review_text':my_review.review_text,
        'review_rating':my_review.review_rating,
        'review_made_time':my_review.review_made_time.strftime('%Y-%m-%d')
    }

    return {'my_review':result},200



@review_bp.route("/reviews/my_reviews",methods=['GET'])
def get_my_reviews():
    curr_user=g.curr_user

    my_reviews=Review.query.filter_by(author=curr_user).all()
    result=[]
    for each_review in my_reviews:
        result.append({
            'review_id':each_review.id,
            'review_text':each_review.review_text,
            'review_rating':each_review.review_rating,
            'review_made_time':each_review.review_made_time.strftime('%Y-%m-%d'),
            'booking_id':each_review.booking_id,
            'parking_space_id':each_review.parking_space_id
        })
    return {'my_reviews':result},200



@review_bp.route("/reviews/my_reviews/<int:review_id>",methods=['DELETE'])
def delete_my_review(review_id):
    curr_user=g.curr_user
    
    my_review=Review.query.filter_by(author=curr_user,id=review_id).first()
    if my_review==None: return {'error':'invalid input'},400

    #update rating for the underlying parking space
    target_parking_space=my_review.parking_space
    reviews_count=len(list(target_parking_space.reviews))
    if reviews_count==1:
        target_parking_space.average_rating=None
    else:
        new_rating=(target_parking_space.average_rating*reviews_count-my_review.review_rating)\
            /(reviews_count-1)
        target_parking_space.average_rating=new_rating

    try:
        db.session.add(target_parking_space)
        db.session.delete(my_review)
        db.session.commit()
    except:
        return {'error':'db internal error'},400

    return {},200
