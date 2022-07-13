from . import parkingspace_bp
from flask import request,g
from .. import db
from ..models import Parking_space, Parking_time_range
from datetime import datetime


@parkingspace_bp.route('/myparkingspace',methods=['GET'])
def myparkingspacelisting():
    curr_user=g.curr_user

    all_parking_spaces=[]

    for each_parking_space in Parking_space.query.filter_by(user=curr_user).all():
        result={
            "id":each_parking_space.id,
            "owner":curr_user.username,
            "street":each_parking_space.street,
            "suburb":each_parking_space.suburb,
            "state":each_parking_space.state,
            "postcode":each_parking_space.postcode,
            "width":each_parking_space.width,
            "length":each_parking_space.length,
            "price":each_parking_space.price
        }

        date_range=[]
        for each_listing in Parking_time_range.query.filter_by(parking_space=each_parking_space):
            duration=(each_listing.end_date-each_listing.start_date).total_seconds()/86400
            date_range.append({
                "listing_id":each_listing.id,
                "start_date:":each_listing.start_date.strftime('%Y-%m-%d'),
                "end_date":each_listing.end_date.strftime('%Y-%m-%d'),
                "duration":duration,
                "total_price":each_parking_space.price*duration
            })

        result["current_listings"]=date_range
        print(result)

        all_parking_spaces.append(result)

    
    return {"all_parkingspaces":all_parking_spaces},200


@parkingspace_bp.route('/myparkingspace/new',methods=['POST'])
def myparkingspaceNew():
    curr_user=g.curr_user
    request_data=request.get_json()

    try:
        new_parking_space=Parking_space(
            user=curr_user,street=request_data.get('street'),suburb=request_data.get('suburb'),\
            state=request_data.get('state'),postcode=request_data.get('postcode'),\
            width=request_data.get('width'),length=request_data.get('length'),\
            price=request_data.get('price')
        )
        db.session.add(new_parking_space)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    new_parkingspace_id=Parking_space.query.all()[-1].id

    return {'new_parkingspace_id':new_parkingspace_id},200


@parkingspace_bp.route('/myparkingspace/publish/<int:parkingspace_id>',methods=['PUT'])
def publishParkingSpace(parkingspace_id):
    request_data=request.get_json()
    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()

    if target_parking_space==None:
        return {'error':'parkingspace not found'},400

    try:
        try:
            #start_date,end_date是一个Date类型的对象
            start_date=datetime.strptime(request_data.get('start_date'),'%Y-%m-%d').date()
            end_date=datetime.strptime(request_data.get('end_date'),'%Y-%m-%d').date()
        except:
            return {'error':'invalid time format'},400

        new_listing=Parking_time_range(start_date=start_date,end_date=end_date,\
            parking_space=target_parking_space)
        
        db.session.add(new_listing)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    new_listing_id=Parking_time_range.query.all()[-1].id

    return {'new_listing_id':new_listing_id},200


@parkingspace_bp.route('/myparkingspace/unpublish/<int:parkingspace_id>',methods=['PUT'])
def unpublishParkingSpace(parkingspace_id):
    all_listings=Parking_time_range.query.filter_by(parking_space_id=parkingspace_id).all()

    try:
        for each_listing in all_listings:
            db.session.delete(each_listing)
    except:
        return {'error':'internal error'},400

    db.session.commit()
    return {},200



@parkingspace_bp.route('/myparkingspace/<int:parkingspace_id>',methods=['GET'])
def getParkingSpace(parkingspace_id):
    curr_user=g.curr_user
    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None:
        return {'error':'invalid parking space'},400

    detail={
                "id":target_parking_space.id,
                "owner":curr_user.username,
                "street":target_parking_space.street,
                "suburb":target_parking_space.suburb,
                "state":target_parking_space.state,
                "postcode":target_parking_space.postcode,
                "width":target_parking_space.width,
                "length":target_parking_space.length,
                "price":target_parking_space.price,
                "published":False,
                "current_listings":[]
            }

    all_listings=Parking_time_range.query.filter_by(parking_space=target_parking_space).all()
    print(all_listings)

    if all_listings:
        detail["published"]=True
        for each_listing in all_listings:
            #duration in days
            duration=(each_listing.end_date-each_listing.start_date).total_seconds()/86400
            listing={"listing_id":each_listing.id,
                "start_date:":each_listing.start_date.strftime('%Y-%m-%d'),
                "end_date":each_listing.end_date.strftime('%Y-%m-%d'),
                "duration":duration,
                "total_price":target_parking_space.price*duration
                }
            detail["current_listings"].append(listing)        
        
    #TODO:reviews
    
    return detail,200


@parkingspace_bp.route('/myparkingspace/<int:parkingspace_id>',methods=['DELETE'])
def deleteParkingSpace(parkingspace_id):
    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None:
        return {'error':'invalid parking space'},400
    
    db.session.delete(target_parking_space)
    db.session.commit()

    return {},200


@parkingspace_bp.route('/myparkingspace/<int:parkingspace_id>',methods=['PUT'])
def updateParkingSpace(parkingspace_id):
    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space==None:
        return {'error':'invalid parking space'},400

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

    db.session.add(target_parking_space)
    db.session.commit()

    return {},200
