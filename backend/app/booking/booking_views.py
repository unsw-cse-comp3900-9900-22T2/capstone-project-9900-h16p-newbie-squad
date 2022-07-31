from ..models import Available_Period, Billing, Booking, Status, Parking_space, Credit_card, Bank_account
from . import booking_bp
from flask import g, request, app
from .. import db
from datetime import datetime, timedelta



def parseStatusCode(status_code):
    match status_code:
        case Status.Accepted_Payment_Required: return 'Accepted_Payment_Required'
        case Status.Successful: return 'Successful'
        case Status.Cancelled: return 'Cancelled'


@booking_bp.route("/bookings/mybookings",methods=['GET'])
def getMyBookings():
    curr_user=g.curr_user

    mybookings=[]
    for eachOfMyBooking in Booking.query.filter_by(customer=curr_user).all():
        target_parking_space=eachOfMyBooking.parking_space

        address = 'Address: %s %s %s %s.' % (target_parking_space.street, target_parking_space.suburb,
                                            target_parking_space.state, target_parking_space.postcode)
        price=target_parking_space.price
        start_date=eachOfMyBooking.start_date.strftime('%Y-%m-%d')
        end_date=eachOfMyBooking.end_date.strftime('%Y-%m-%d')
        print(eachOfMyBooking.parking_space)

        mybookings.append({
            'booking_id':eachOfMyBooking.id,
            'parking_space_id':eachOfMyBooking.parking_space_id,
            'booking_time':eachOfMyBooking.booking_time.strftime('%Y-%m-%d,%H-%M-%S'),
            'start_date':eachOfMyBooking.start_date.strftime('%Y-%m-%d'),
            'end_date':eachOfMyBooking.end_date.strftime('%Y-%m-%d'),
            'status':parseStatusCode(eachOfMyBooking.status),
            'address': address,
            'price':target_parking_space.price,
            "time_remaining":None if eachOfMyBooking.status!=Status.Accepted_Payment_Required \
                else Status.Must_Pay_Within-(datetime.now()-eachOfMyBooking.booking_time).total_seconds()
        })
    
    return {'mybookings':mybookings},200
        


#2022.7.25修改：接收的参数现在是parkingspace_id
@booking_bp.route("/bookings/new/<int:parkingspace_id>",methods=['PUT'])
def makeBookingRequest(parkingspace_id):
    curr_user=g.curr_user
    request_data = request.get_json()

    try:
        start_date = datetime.strptime(request_data.get('start_date'), '%Y-%m-%d').date()
        end_date = datetime.strptime(request_data.get('end_date'), '%Y-%m-%d').date()
    except:
        return {'error': 'invalid time format'}, 400

    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()

    if target_parking_space==None: return {'error':'cannot find this parking space'},400

    available_slot=None
    for each_available_period in target_parking_space.available_periods:
        #找到一个可用时间段
        if each_available_period.start_date<=start_date and each_available_period.end_date>=end_date:
            available_slot=each_available_period
            break

    if available_slot==None:
        return {'error':'period is not available'},400
    
    #切割之后的新时间段
    new_slot_1=Available_Period(start_date=available_slot.start_date,end_date=start_date-timedelta(1),\
        parking_space=target_parking_space) if available_slot.start_date<start_date else None
    new_slot_2=Available_Period(start_date=end_date+timedelta(1),end_date=available_slot.end_date,\
        parking_space=target_parking_space) if available_slot.end_date>end_date else None

    new_booking=Booking(parking_space=target_parking_space,
                        customer=curr_user,
                        start_date=start_date,
                        end_date=end_date,
                        status=Status.Accepted_Payment_Required)

    try:
        if new_slot_1!=None: db.session.add(new_slot_1) 
        if new_slot_2!=None: db.session.add(new_slot_2)
        db.session.add(new_booking)
        db.session.delete(available_slot)
        db.session.commit()
    except: 
        return {'error':'db internal error'},400

    new_booking_id=Booking.query.all()[-1].id

    return {'new_booking_id':new_booking_id},200



@booking_bp.route("/bookings/cancel/<int:booking_id>",methods=['POST'])
def cancelBooking(booking_id):
    target_booking=Booking.query.filter_by(id=booking_id).first()
    if target_booking==None:
        return {'error':'cannot find this booking'},400
    if target_booking.status!=Status.Accepted_Payment_Required:
        return {'error':'this booking is not in Accepted_Payment_Required state,\
                you cannot cancel it'},400

    old_slot_1=Available_Period.query.filter_by(end_date=(target_booking.start_date-timedelta(1))).first()
    old_slot_2=Available_Period.query.filter_by(start_date=(target_booking.end_date+timedelta(1))).first()

    if old_slot_1!=None and old_slot_2!=None:
        new_slot=Available_Period(parking_space=target_booking.parking_space,
                                start_date=old_slot_1.start_date,
                                end_date=old_slot_2.end_date)
    elif old_slot_2==None:
        new_slot=Available_Period(parking_space=target_booking.parking_space,
                                start_date=old_slot_1.start_date,
                                end_date=target_booking.end_date)
    elif old_slot_1==None:
        new_slot=Available_Period(parking_space=target_booking.parking_space,
                                start_date=target_booking.start_date,
                                end_date=old_slot_2.end_date)

    target_booking.status=Status.Cancelled
    try:
        db.session.add(target_booking)
        db.session.add(new_slot)
        if old_slot_1!=None: db.session.delete(old_slot_1)
        if old_slot_2!=None: db.session.delete(old_slot_2)
        db.session.commit()
    except:
        return {'error':'db internal error'},400
    return {},200



#返回所有我旗下所有parking_space的所有booking
@booking_bp.route("/bookings/my_received_bookings",methods=['GET'])
def myReceivedBookings():
    curr_user=g.curr_user
    
    myReceivedBookings=[]
    for each_parkingspace in Parking_space.query.filter_by(owner=curr_user).all():
        if each_parkingspace.bookings:
            myReceivedBookings.extend(each_parkingspace.bookings)

    result=[]
    for eachBooking in myReceivedBookings:
        target_parking_space = eachBooking.parking_space
        address = 'Address: %s %s %s %s.' % (target_parking_space.street, target_parking_space.suburb,
                                             target_parking_space.state, target_parking_space.postcode)
        result.append({
            'booking_id':eachBooking.id,
            'parking_space_id':eachBooking.parking_space_id,
            'customer_id':eachBooking.customer_id,
            'start_date':eachBooking.start_date.strftime('%Y-%m-%d'),
            'end_date':eachBooking.end_date.strftime('%Y-%m-%d'),
            'booking_made_time':eachBooking.booking_time.strftime('%Y-%m-%d,%H-%M-%S'),
            'status':parseStatusCode(eachBooking.status),
            'address': address,
            'price':target_parking_space.price
        })
    
    return {'my_received_bookings':result},200



@booking_bp.route("/bookings/pay/<int:booking_id>",methods=['POST'])
def payForBooking(booking_id):
    target_booking=Booking.query.filter_by(id=booking_id).first()

    if target_booking==None:
        return {'error':'cannot find this booking'},400
    if target_booking.status!=Status.Accepted_Payment_Required:
        return {'error':'this booking hasn\'t been accepted yet'},400

    target_parking_space=target_booking.parking_space

    provider=target_parking_space.owner
    customer=target_booking.customer

    provider_bank_account=provider.bank_account if provider.bank_account else 'None'
    customer_card_number=request.get_json().get('card_number')

    address='Address: %s %s %s %s.'%(target_parking_space.street,target_parking_space.suburb,\
        target_parking_space.state,target_parking_space.postcode)

    start_date=target_booking.start_date
    end_date=target_booking.end_date

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

    try:
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200


