from ..models import Billing, Listing, Booking, Status, Parking_space, Credit_card, Bank_account
from . import booking_bp
from flask import g, request
from .. import db
from threading import Thread, Lock
from time import sleep
from datetime import datetime

def parseStatusCode(status_code):
    match status_code:
        case Status.Pending: return 'Pending'
        case Status.Accepted_Payment_Required: return 'Accepted_Payment_Required'
        case Status.Rejected: return 'Rejected'
        case Status.Successful: return 'Successful'
        case Status.Cancelled: return 'Cancelled'


#     while True:
#         print("hello,world!")
#         sleep(3)
    
# test=Thread(target=hello)
# test.run()


@booking_bp.route("/bookings/mybookings",methods=['GET'])
def getMyBookings():
    curr_user=g.curr_user

    mybookings=[]
    for eachOfMyBooking in Booking.query.filter_by(customer=curr_user).all():
        target_listing = Listing.query.filter_by(id=eachOfMyBooking.listing_id).first()
        target_parking_space = Parking_space.query.filter_by(id=target_listing.parking_space_id).first()
        address = 'Address: %s %s %s %s.' % (target_parking_space.street, target_parking_space.suburb,
                                             target_parking_space.state, target_parking_space.postcode)
        mybookings.append({
            'booking_id':eachOfMyBooking.id,
            'listing_id':eachOfMyBooking.listing_id,
            'booking_time':eachOfMyBooking.booking_time.strftime('%Y-%m-%d,%H-%M-%S'),
            'start_date': eachOfMyBooking.start_date.strftime('%Y-%m-%d'),
            'end_date': eachOfMyBooking.end_date.strftime('%Y-%m-%d'),
            'status':parseStatusCode(eachOfMyBooking.status),
            'address': address,
            'price':target_parking_space.price
        })
    
    return {'mybookings':mybookings},200
        


#make a new booking request towards listing: listing_id
big_lock=Lock()
@booking_bp.route("/bookings/new/<int:listing_id>",methods=['PUT'])
def makeBookingRequest(listing_id):
    big_lock.acquire()
    curr_user=g.curr_user
    request_data = request.get_json()
    try:
        # start_date,end_date是一个Date类型的对象
        start_date = datetime.strptime(request_data.get('start_date'), '%Y-%m-%d').date()
        end_date = datetime.strptime(request_data.get('end_date'), '%Y-%m-%d').date()
    except:
        return {'error': 'invalid time format'}, 400

    target_listing=Listing.query.filter_by(id=listing_id).first()

    if target_listing==None:
        big_lock.release()
        return {'error':'cannot find this listing'},400

    for eachBooking in target_listing.bookings:
        if eachBooking.status==Status.Accepted_Payment_Required:
            big_lock.release()
            return {'error':'this listing is already booked by other people'},400

    new_booking=Booking(listing=target_listing,
                        customer=curr_user,
                        start_date=start_date,
                        end_date=end_date,
                        status=Status.Accepted_Payment_Required)

    try:
        db.session.add(new_booking)
        db.session.commit()
    except:
        big_lock.release()
        return {'error':'internal error'},400
    
    new_booking_id=Booking.query.all()[-1].id

    big_lock.release()
    return {'new_booking_id':new_booking_id},200



#返回所有我publish的listing的booking request
@booking_bp.route("/bookings/mylistings",methods=['GET'])
def fetchBookingsOfMyListings():
    curr_user=g.curr_user
    
    #先遍历当前用户的所有parking space，如果这个parking space已经publish了
    #则这个parking space的所有listing加入listing的列表
    #再遍历这个listing列表，找出对应的booking
    myListings=[]
    for each_parkingspace in Parking_space.query.filter_by(owner=curr_user).all():
        if each_parkingspace.listings:
            myListings.extend(each_parkingspace.listings)
    if len(myListings)==0:
        return {'myListings':myListings},200
    
    #here myBookingRequests means those booking requests towards my listing
    myBookingRequests=[]
    for eachListing in myListings:
        if eachListing.bookings:
            myBookingRequests.extend(eachListing.bookings)
    if len(myBookingRequests)==0:
        return {'myBookingRequests':myBookingRequests},200

    result=[]
    for eachRequest in myBookingRequests:
        target_listing = Listing.query.filter_by(id=eachRequest.listing_id).first()
        target_parking_space = Parking_space.query.filter_by(id=target_listing.parking_space_id).first()
        address = 'Address: %s %s %s %s.' % (target_parking_space.street, target_parking_space.suburb,
                                             target_parking_space.state, target_parking_space.postcode)
        result.append({
            'booking_id':eachRequest.id,
            'customer_id':eachRequest.customer_id,
            'start_date':eachRequest.start_date.strftime('%Y-%m-%d'),
            'end_date':eachRequest.end_date.strftime('%Y-%m-%d'),
            'booking_time':eachRequest.booking_time.strftime('%Y-%m-%d,%H-%M-%S'),
            'status':parseStatusCode(eachRequest.status),
            'address': address,
            'price':target_parking_space.price
        })
    
    return {'myRequests':result},200


'''
big_lock=Lock()
@booking_bp.route("/bookings/accept/<int:booking_id>",methods=['POST'])
def acceptBooking(booking_id):
    #先从当前booking找出属于当前booking的listing
    #再检查这个listing的所有的booking，确保这个listing所有的booking request都还没有被accept
    #确保原子性
    try:
        big_lock.acquire()
        target_booking=Booking.query.filter_by(id=booking_id).first()
    
        if target_booking==None:
            big_lock.release()
            return {'error':'cannot find this booking'},400
        if target_booking.status!=Status.Pending:
            big_lock.release()
            return {'error':'this booking is not in Pending state, you cannot accept it'},400

        #确保provider只能接受一个booking
        target_listing=target_booking.listing
        for eachBookingRequest in Booking.query.filter_by(listing=target_listing).all():
            if eachBookingRequest.status==Status.Accepted_Payment_Required:
                big_lock.release()
                return {'error':'already booked'},400

        target_booking.status=Status.Accepted_Payment_Required
        db.session.add(target_booking)
        db.session.commit()
        big_lock.release()
    except:
        big_lock.release()
        return {'error':'internal error'},400

    return {},200
'''


'''
@booking_bp.route("/bookings/reject/<int:booking_id>",methods=['POST'])
def rejectBooking(booking_id):
    try:
        target_booking=Booking.query.filter_by(id=booking_id).first()

        if target_booking==None:
            return {'error':'cannot find this booking'},400
        if target_booking.status!=Status.Pending:
            return {'error':'this booking is not in Pending state, you cannot reject it'},400

        target_booking.status=Status.Rejected
        db.session.add(target_booking)
        db.session.commit()
    except:
        return {'error':'internal error'},400
    return {},200
'''


@booking_bp.route("/bookings/cancel/<int:booking_id>",methods=['POST'])
def cancelBooking(booking_id):
    try:
        target_booking=Booking.query.filter_by(id=booking_id).first()
        if target_booking==None:
            return {'error':'cannot find this booking'},400
        if target_booking.status!=Status.Accepted_Payment_Required:
            return {'error':'this booking is not in Accepted_Payment_Required state,\
                 you cannot cancel it'},400

        target_booking.status=Status.Cancelled
        db.session.add(target_booking)
        db.session.commit()
    except:
        return {'error':'internal error'},400
    return {},200



@booking_bp.route("/bookings/pay/<int:booking_id>",methods=['POST'])
def payForBooking(booking_id):
    #这里应该加入支付逻辑，这里不管
    #可增加功能：从用户预留的信用卡信息中扣款

    target_booking=Booking.query.filter_by(id=booking_id).first()

    if target_booking==None:
        return {'error':'cannot find this booking'},400
    if target_booking.status!=Status.Accepted_Payment_Required:
        return {'error':'this booking hasn\'t been accepted yet'},400

    target_listing=target_booking.listing
    target_parking_space=target_listing.parking_space

    provider=target_parking_space.owner
    customer=target_booking.customer

    provider_bank_account=provider.bank_account if provider.bank_account else 'None'
    customer_card_number=request.get_json().get('card_number')

    address='Address: %s %s %s %s.'%(target_parking_space.street,target_parking_space.suburb,\
        target_parking_space.state,target_parking_space.postcode)
    start_date=target_listing.start_date
    end_date=target_listing.end_date
    unit_price=target_parking_space.price
    total_price=unit_price*((end_date-start_date).total_seconds()/86400)

    this_billing=Billing(
        #永久保存订单成功当时的provider和customer的id，便于后面搜索历史订单
        provider_id=provider.id,
        customer_id=customer.id,
        #永久保存订单成功当时的provider和customer的username
        provider_name=provider.username,
        customer_name=customer.username,
        #这张表只是存储历史记录，因此address不再分开了，生成历史记录的时候把street，suburb等合成一个字符串
        address=address,
        start_date=start_date,
        end_date=end_date,
        unit_price=unit_price,
        total_price=total_price,
        #永久保存customer付款时用的银行卡号
        customer_card_number=customer_card_number,
        #永久保存provider收款时用的账户号
        provider_bank_account=provider_bank_account
    )

    #向数据库中添加订单历史记录
    db.session.add(this_billing)

    #更新成功支付的这个booking的状态为Successful
    target_booking.status=Status.Successful
    db.session.add(target_booking)

    '''#所有处于其他状态的booking自动转为rejected
    for eachBooking in target_listing.bookings:
        if eachBooking.status==Status.Pending:
            eachBooking.status=Status.Rejected
            db.session.add(eachBooking)'''
    
    #原listing自动下架
    db.session.delete(target_listing)

    try:
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200


