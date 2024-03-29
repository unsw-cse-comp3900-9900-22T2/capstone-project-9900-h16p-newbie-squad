from . import parkingspace_bp
from flask import request,g
from .. import db
from ..models import Available_Period, Parking_space, Status
from datetime import datetime
import base64


@parkingspace_bp.route('/myparkingspace',methods=['GET'])
def myparkingspaces():
    curr_user=g.curr_user

    all_parking_spaces=[]

    #only return parking spaces for which is_active==True
    #if is_active==False, this parking space has been deleted by the owner
    for each_parking_space in Parking_space.query.filter_by(owner=curr_user,is_active=True).all():
        result={
            "id":each_parking_space.id,
            "owner":curr_user.username,
            "street":each_parking_space.street,
            "suburb":each_parking_space.suburb,
            "state":each_parking_space.state,
            "postcode":each_parking_space.postcode,
            "width":each_parking_space.width,
            "length":each_parking_space.length,
            "price":each_parking_space.price,
            "latitude":each_parking_space.latitude,
            "longitude":each_parking_space.longitude,
            "average_rating":each_parking_space.average_rating,
            "avatar":base64.b64encode(each_parking_space.picture_1).decode() if each_parking_space.picture_1 else None
        }

        available_periods=[]
        for each_available_period in each_parking_space.available_periods:
            available_periods.append({
                "start_date":each_available_period.start_date.strftime('%Y-%m-%d'),
                "end_date":each_available_period.end_date.strftime('%Y-%m-%d'),
            })

        result["available_periods"]=available_periods

        all_parking_spaces.append(result)

    return {"all_parkingspaces":all_parking_spaces},200



@parkingspace_bp.route('/myparkingspace/new',methods=['POST'])
def myparkingspaceNew():
    curr_user=g.curr_user

    request_data=request.get_json()

    picture_1=base64.b64decode(request_data.get('picture_1')) if request_data.get('picture_1') else None
    picture_2=base64.b64decode(request_data.get('picture_2')) if request_data.get('picture_2') else None
    picture_3=base64.b64decode(request_data.get('picture_3')) if request_data.get('picture_3') else None

    try:
        new_parking_space=Parking_space(
            owner=curr_user,street=request_data.get('street'),suburb=request_data.get('suburb'),\
            state=request_data.get('state'),postcode=request_data.get('postcode'),\
            width=request_data.get('width'),length=request_data.get('length'),\
            price=request_data.get('price'),latitude=request_data.get('latitude'),\
            longitude=request_data.get('longitude'),is_active=True,\
            picture_1=picture_1,
            picture_2=picture_2,
            picture_3=picture_3,
        )
        db.session.add(new_parking_space)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    new_parkingspace_id=Parking_space.query.all()[-1].id

    return {'new_parkingspace_id':new_parkingspace_id},200




@parkingspace_bp.route('/myparkingspace/<int:parkingspace_id>',methods=['GET'])
def getParkingSpace(parkingspace_id):
    curr_user=g.curr_user

    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None: return {'error':'invalid parking space'},400

    detail={"id":target_parking_space.id,
            "owner":curr_user.username,
            "street":target_parking_space.street,
            "suburb":target_parking_space.suburb,
            "state":target_parking_space.state,
            "postcode":target_parking_space.postcode,
            "latitude":target_parking_space.latitude,
            "longitude":target_parking_space.longitude,
            "width":target_parking_space.width,
            "length":target_parking_space.length,
            "price":target_parking_space.price,
            "average_rating":target_parking_space.average_rating,
            "picture_1":base64.b64encode(target_parking_space.picture_1).decode() if target_parking_space.picture_1 else None,
            "picture_2":base64.b64encode(target_parking_space.picture_2).decode() if target_parking_space.picture_2 else None,
            "picture_3":base64.b64encode(target_parking_space.picture_3).decode() if target_parking_space.picture_3 else None,
            "available_periods":[]}
   
    for each_available_period in target_parking_space.available_periods:
        available_period={
            "start_date:":each_available_period.start_date.strftime('%Y-%m-%d'),
            "end_date":each_available_period.end_date.strftime('%Y-%m-%d'),
        }
        detail["available_periods"].append(available_period)        
        
    return detail,200


@parkingspace_bp.route('/myparkingspace/<int:parkingspace_id>',methods=['DELETE'])
def deleteParkingSpace(parkingspace_id):
    curr_user=g.curr_user

    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None: return {'error':'invalid parking space'},400
    
    try:
        for each_available_period in target_parking_space.available_periods:
            db.session.delete(each_available_period)

        for each_booking in target_parking_space.bookings:
            if each_booking.status==Status.Accepted_Payment_Required:
                each_booking.status=Status.Cancelled
                db.session.add(each_booking)

        target_parking_space.is_active=False
        db.session.add(target_parking_space)
        db.session.commit()
    except:
        return {'error':'db internal error'}

    return {},200



@parkingspace_bp.route('/myparkingspace/<int:parkingspace_id>',methods=['PUT'])
def updateParkingSpace(parkingspace_id):
    curr_user=g.curr_user

    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None: return {'error':'invalid parking space'},400

    info_to_update = request.get_json()

    if info_to_update.get('street'):
        target_parking_space.street = info_to_update['street']
    if info_to_update.get('suburb'):
        target_parking_space.suburb = info_to_update['suburb']
    if info_to_update.get('state'):
        target_parking_space.state = info_to_update['state']
    if info_to_update.get('postcode'):
        target_parking_space.postcode = info_to_update['postcode']
    if info_to_update.get('width'):
        target_parking_space.width = info_to_update['width']
    if info_to_update.get('length'):
        target_parking_space.length = info_to_update['length']
    if info_to_update.get('price'):
        target_parking_space.price = info_to_update['price']
    if info_to_update.get('latitude'):
        target_parking_space.latitude = info_to_update['latitude']
    if info_to_update.get('longitude'):
        target_parking_space.longitude = info_to_update['longitude']
    if info_to_update.get('picture_1'):
        target_parking_space.picture_1 = base64.b64decode(info_to_update['picture_1'])
    if info_to_update.get('picture_2'):
        target_parking_space.picture_2 = base64.b64decode(info_to_update['picture_2'])
    if info_to_update.get('picture_3'):
        target_parking_space.picture_3 = base64.b64decode(info_to_update['picture_3'])

    db.session.add(target_parking_space)
    db.session.commit()

    return {},200



@parkingspace_bp.route('/myparkingspace/publish/<int:parkingspace_id>',methods=['PUT'])
def publishParkingSpace(parkingspace_id):
    curr_user=g.curr_user

    request_data=request.get_json()
    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None or target_parking_space.is_active==False:
        return {'error':'active parkingspace not found'},400

    try:
        start_date=datetime.strptime(request_data.get('start_date'),'%Y-%m-%d').date()
        end_date=datetime.strptime(request_data.get('end_date'),'%Y-%m-%d').date()
    except:
        return {'error':'invalid time format'},400

    try:
        new_available_period=Available_Period(start_date=start_date,end_date=end_date,\
            parking_space=target_parking_space)
        db.session.add(new_available_period)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200



@parkingspace_bp.route('/myparkingspace/unpublish/<int:parkingspace_id>',methods=['PUT'])
def unpublishParkingSpace(parkingspace_id):
    curr_user=g.curr_user

    try:
        target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
        if target_parking_space==None or target_parking_space.is_active==False:
            return {'error':'active parkingspace not found'},400

        for each_available_period in target_parking_space.available_periods:
            db.session.delete(each_available_period)

        for each_booking in target_parking_space.bookings:
            if each_booking.status==Status.Accepted_Payment_Required:
                each_booking.status=Status.Cancelled
                db.session.add(each_booking)

        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200






