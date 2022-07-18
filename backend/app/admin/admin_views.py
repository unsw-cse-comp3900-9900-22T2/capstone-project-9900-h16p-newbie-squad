from . import admin_bp
from flask import Blueprint, request, session,url_for,jsonify
from .. import db
from ..models import Role, User, Parking_space, Listing



@admin_bp.route("/admin/listings", methods=['GET'])
def adminGetListings():
    listings = []
    for each_listing in Listing.query.all():
        parking_space = each_listing.parking_space
        listing = {
            "listing_id": each_listing.id,
            "start_date": each_listing.start_date.strftime('%Y-%m-%d'),
            "end_date": each_listing.end_date.strftime('%Y-%m-%d'),
            "published_time": each_listing.published_time.strftime('%Y-%m-%d,%H-%M-%S'),
            "street": parking_space.street,
            "suburb": parking_space.suburb,
            "state": parking_space.state,
            "postcode": parking_space.postcode,
            # "latitude":parking_space.latitude,
            # "longitude":parking_space.longitude,
            "width": parking_space.width,
            "length": parking_space.length,
            "price": parking_space.price
        }
        listings.append(listing)

    return {"all_listings": listings}, 200


@admin_bp.route('/admin/<int:parkingspace_id>', methods=['DELETE'])
def adminDeleteParkingSpace(parkingspace_id):
    # if g.curr_user_role != 'admin':
    #     return {'error': 'you are not admin'}, 400

    target_parking_space = Parking_space.query.filter_by(id=parkingspace_id).first()
    if target_parking_space == None:
        return {'error': 'invalid parking space'}, 400

    db.session.delete(target_parking_space)
    db.session.commit()

    return {}, 200


@admin_bp.route('/admin/<int:parkingspace_id>',methods=['PUT'])
def adminUpdateParkingSpace(parkingspace_id):
    # if g.curr_user_role != 'admin':
    #     return {'error': 'you are not admin'}, 400

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
        target_parking_space.price = info_to_update['latitude']
    if info_to_update.get('longitude'):
        target_parking_space.price = info_to_update['longitude']

    db.session.add(target_parking_space)
    db.session.commit()

    return {},200


# @admin_bp.route('/admin_login',methods=["POST"])
# def adminLogin():
#     print('Postman request: ',end='')
#     print(request)
#     user_info=request.get_json()
#     print(user_info)
#
#     #管理员登录时必须提供username和password
#
#     if user_info.get('username')==None or user_info.get('password')==None:
#         return {"error": "invalid input"},400
#
#     curr_user=User.query.filter_by(username='Admin').first()
#     # 如果这个用户名没有被注册
#     if curr_user==None:
#         return {"error": "invalid username"},400
#
#     if curr_user.verify_password(user_info['password'])!=True:
#         return {"error": "invalid password"},404
#
#     token=curr_user.generate_admin_token()
#
#     return {
#         "token": token
#     },200
#
#
# @admin_bp.route('/admin_logout',methods=["POST"])
# def adminLogout():
#     #这里仅仅只是占位
#     #删除token的操作应该由前端完成
#     return {},200
