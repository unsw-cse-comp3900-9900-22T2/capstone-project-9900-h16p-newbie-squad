from . import admin_bp
from flask import request
from .. import db
from ..models import Parking_space
import base64


@admin_bp.route("/admin/parkingspaces", methods=['GET'])
def adminGetParkingSpaces():

    all_parking_spaces = []
    #admin can see all the parking spaces
    for parking_space in Parking_space.query.filter_by(is_active=True).all():
        all_parking_spaces.append({
                "id": parking_space.id,
                "owner_id": parking_space.owner_id,
                "street": parking_space.street,
                "suburb": parking_space.suburb,
                "state": parking_space.state,
                "postcode": parking_space.postcode,
                "latitude": parking_space.latitude,
                "longitude": parking_space.longitude,
                "width": parking_space.width,
                "length": parking_space.length,
                "price": parking_space.price,
                "is_active": parking_space.is_active,
                "average_rating": parking_space.average_rating,
                "picture_1": (base64.b64encode(parking_space.picture_1)).decode() if parking_space.picture_1 else None,
                "picture_2": (base64.b64encode(parking_space.picture_2)).decode() if parking_space.picture_2 else None,
                "picture_3": (base64.b64encode(parking_space.picture_3)).decode() if parking_space.picture_3 else None,
        })

    return {'admin_all_parking_spaces': all_parking_spaces}, 200


@admin_bp.route("/admin/parkingspaces/<int:parkingspace_id>", methods=['GET'])
def adminGetParkingSpaceDetail(parkingspace_id):
    parkingspace = Parking_space.query.filter_by(id=parkingspace_id).first()
    return_dict = {
                    "id": parkingspace.id,
                    "owner_id": parkingspace.owner_id,
                    "street" : parkingspace.street,
                    "suburb": parkingspace.suburb,
                    "state": parkingspace.state,
                    "postcode": parkingspace.postcode,
                    "latitude": parkingspace.latitude,
                    "longitude": parkingspace.longitude,
                    "width": parkingspace.width,
                    "length": parkingspace.length,
                    "price": parkingspace.price,
                    "is_active": parkingspace.is_active,
                    "average_rating": parkingspace.average_rating,
                    "picture_1": (base64.b64encode(parkingspace.picture_1)).decode() if parkingspace.picture_1 else None,
                    "picture_2": (base64.b64encode(parkingspace.picture_2)).decode() if parkingspace.picture_2 else None,
                    "picture_3": (base64.b64encode(parkingspace.picture_3)).decode() if parkingspace.picture_3 else None,
    }
    return return_dict, 200


@admin_bp.route('/admin/delete/<int:parkingspace_id>', methods=['DELETE'])
def adminDeleteParkingSpace(parkingspace_id):

    target_parking_space = Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space == None:
        return {'error': 'invalid parking space'}, 400

    db.session.delete(target_parking_space)
    db.session.commit()

    return {}, 200


@admin_bp.route('/admin/update/<int:parkingspace_id>',methods=['PUT'])
def adminUpdateParkingSpace(parkingspace_id):

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

    return {}, 200
