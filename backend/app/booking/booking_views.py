from ..models import Listing, Booking, Status, Parking_space
from . import booking_bp
from flask import g
from .. import db
from threading import Thread, Lock
from time import sleep

def parseStatusCode(status_code):
    match status_code:
        case Status.Pending: return 'Pending'
        case Status.Accepted_Payment_Required: return 'Accepted_Payment_Required'
        case Status.Rejected: return 'Rejected'
        case Status.Successful: return 'Successful'
        case Status.Cancelled: return 'Cancelled'


'''
def hello():
    while True:
        print("hello,world!")
        sleep(3)
    
test=Thread(target=hello)
test.run()
'''


@booking_bp.route("/bookings/mybookings",methods=['GET'])
def getMyBookings():
    curr_user=g.curr_user

    mybookings=[]
    for eachOfMyBooking in Booking.query.filter_by(customer=curr_user).all():
        mybookings.append({
            'booking_id':eachOfMyBooking.id,
            'listing_id':eachOfMyBooking.listing_id,
            'booking_time':eachOfMyBooking.booking_time.strftime('%Y-%m-%d,%H-%M-%S'),
            'status':parseStatusCode(eachOfMyBooking.status)
        })
    
    return {'mybookings':mybookings},200
        


@booking_bp.route("/bookings/new/<int:listing_id>",methods=['POST'])
def makeBookingRequest(listing_id):
    curr_user=g.curr_user

    target_listing=Listing.query.filter_by(id=listing_id).first()
    print(target_listing)
    print(curr_user)
    new_booking=Booking(listing=target_listing,customer=curr_user,status=Status.Pending)
    print(new_booking)
    try:
        db.session.add(new_booking)
        db.session.commit()
    except:
        return {'error':'internal error'},400
    
    new_booking_id=Booking.query.all()[-1].id

    return {'new_booking_id':new_booking_id},200



@booking_bp.route("/bookings/mylistings",methods=['GET'])
def fetchBookingsOfMyListings():
    curr_user=g.curr_user
    
    #先找出当前用户的parking space，再从这个parking space找出当前用户的listing
    #再从这些listing中找出来对应的booking
    myListings=[]
    for each_parkingspace in Parking_space.query.filter_by(owner=curr_user).all():
        if each_parkingspace.listings:
            myListings.extend(each_parkingspace.listings)
    
    #here myBookingRequests means those booking requests towards my listing
    myBookingRequests=[]
    for eachListing in myListings:
        if eachListing.bookings:
            myBookingRequests.extend(eachListing.bookings)
    
    result=[]
    for eachRequest in myBookingRequests:
        result.append({
            'booking_id':eachRequest.id,
            'customer_id':eachRequest.customer_id,
            'booking_time':eachRequest.booking_time.strftime('%Y-%m-%d,%H-%M-%S'),
            'status':parseStatusCode(eachRequest.status)
        })
    
    return {'myRequests':result},200




@booking_bp.route("/bookings/accept/<int:booking_id>",methods=['POST'])
def acceptBooking(booking_id):
    #先从当前booking找出属于当前booking的listing
    #再检查这个listing的所有的booking，确保这个listing所有的booking request都还没有被accept
    #确保原子性
    big_lock=Lock()
    big_lock.acquire()

    target_booking=Booking.query.filter_by(id=booking_id).first()
    target_listing=target_booking.listing

    for eachBookingRequest in Booking.query.filter_by(listing=target_listing).all():
        if eachBookingRequest.status==Status.Accepted_Payment_Required:
            big_lock.release()
            return {'error':'already booked'},400

    target_booking.status=Status.Accepted_Payment_Required
    db.session.add(target_booking)
    db.session.commit()
    big_lock.release()

    return {},200


@booking_bp.route("/bookings/reject/<int:booking_id>",methods=['POST'])
def rejectBooking(booking_id):
    target_booking=Booking.query.filter_by(id=booking_id).first()
    target_booking.status=Status.Rejected
    db.session.add(target_booking)
    db.session.commit()
    return {},200



