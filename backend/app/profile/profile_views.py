from . import profile_bp

from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request,render_template, redirect, session,url_for,jsonify

from .. import db
from ..models import Role, User, Vehicle, Vehicle_type, Parking_space, Parking_space_type

@profile_bp.route('/profile/<int:usr_id>',methods=["GET", "POST"])
def profile(user_id):
    # print('Postman request: ',end='')
    # print(request)
    # new_user_info=request.get_json()
    # print(new_user_info)

    if request.method == 'GET':
        user = User.query.filter_by(id=user_id).first()
        if user == None:
            return {"error": "user not found"}, 404
        return jsonify(user.to_json()), 200
    elif request.method == 'POST':
        # 是否加判断是否是admin
        new_user_info = request.get_json()
        # update user table by new_usr_info: username, email, phone_num, bank_account, avatar, bio, role_id
        # if user type is not admin

        user = User.query.filter_by(id=user_id).first()
        if new_user_info['username']:
            # update username
            user.username = new_user_info['username']
        if new_user_info['email']:
            # update email
            user.email = new_user_info['email']
        if new_user_info['phone_num']:
            # update phone_num
            user.phone_num = new_user_info['phone_num']
        if new_user_info['bank_account']:
            # update bank_account
            user.bank_account = new_user_info['bank_account']
        if new_user_info['avatar']:
            # update avatar
            user.avatar = new_user_info['avatar']
        if new_user_info['bio']:
            # update bio
            user.bio = new_user_info['bio']
        if new_user_info['role_id']:
            # update role_id
            user.role_id = new_user_info['role_id']
        if new_user_info['vehicle']:
            # vehicle 为嵌套字典
            for item in new_user_info['vehicle']:
                # if item['vehicle_license_plate] is not none
                if item['vehicle_license_plate']:
                    # if vehicle_license_plate is not in db
                    if Vehicle.query.filter_by(vehicle_license_plate=item['vehicle_license_plate']).first() is None:
                        # add vehicle
                        vehicle = Vehicle(vehicle_license_plate=item['vehicle_license_plate'],
                                          vehicle_type_id=item['vehicle_type_id'],
                                          vehicle_owner_id=user_id,
                                          vehicle_height=item['vehicle_height'],
                                          vehicle_width=item['vehicle_width'],
                                          vehicle_length=item['vehicle_length'])
                        db.session.add(vehicle)
                    # if vehicle_license_plate is in db, update it
                    else:
                        vehicle = Vehicle.query.filter_by(vehicle_license_plate=item['vehicle_license_plate']).first()
                        vehicle.vehicle_license_plate = item['vehicle_license_plate']
                        vehicle.vehicle_type_id = item['vehicle_type_id']
                        vehicle.vehicle_owner_id = user_id
                        vehicle.vehicle_height = item['vehicle_height']
                        vehicle.vehicle_width = item['vehicle_width']
                        vehicle.vehicle_length = item['vehicle_length']
            db.session.commit()
        if new_user_info['parking_space']:
            # parking_space 为嵌套字典
            for item in new_user_info['parking_space']:
                # if item['arking_space_address'] is not none
                if item['parking_space_address']:
                    # if parking_space_address is not in db
                    if Parking_space.query.filter_by(parking_space_address=item['parking_space_address']).first() is None:
                        # add parking_space
                        parking_space = Parking_space(parking_space_address=item['parking_space_address'],
                                                      parking_space_type_id=item['parking_space_type_id'],
                                                      parking_space_owner_id=user_id,
                                                      parking_space_height=item['parking_space_height'],
                                                      parking_space_width=item['parking_space_width'],
                                                      parking_space_length=item['parking_space_length'],
                                                      parking_space_is_booked=item['parking_space_is_booked'],
                                                      parking_space_price=item['parking_space_price'],
                                                      parking_space_start_date=item['parking_space_start_date'],
                                                      parking_space_end_date=item['parking_space_end_date']
                                                      )
                        db.session.add(parking_space)
                    # if parking_space_address is in db, update it
                    else:
                        parking_space = Parking_space.query.filter_by(parking_space_address=item['parking_space_address']).first()
                        parking_space.parking_space_address = item['parking_space_address']
                        parking_space.parking_space_type_id = item['parking_space_type_id']
                        parking_space.parking_space_owner_id = user_id
                        parking_space.parking_space_height = item['parking_space_height']
                        parking_space.parking_space_width = item['parking_space_width']
                        parking_space.parking_space_length = item['parking_space_length']
                        parking_space.parking_space_is_booked = item['parking_space_is_booked']
                        parking_space.parking_space_price = item['parking_space_price']
                        parking_space.parking_space_start_date = item['parking_space_start_date']
                        parking_space.parking_space_end_date = item['parking_space_end_date']
            db.session.commit()
        db.session.commit()
        return {}, 200





