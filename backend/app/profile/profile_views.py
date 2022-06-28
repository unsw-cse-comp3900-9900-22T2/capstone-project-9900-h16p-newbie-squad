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
        if not user:
            return {"error": "user not found"}, 404
        return jsonify(user.to_json()), 200
    elif request.method == 'POST':
        # 是否加判断是否是admin
        new_user_info = request.get_json()
        # update user table by new_usr_info: username, email, phone_num, bank_account, avatar, bio, role_id
        user = User.query.filter_by(id=user_id).first()
        if Role.query.filter_by(id=user.role_id).first().role_name != 'admin':
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

            db.session.commit()
            return {}, 200

@profile_bp.route('/my_vehicle/<int:usr_id>', methods=["GET", "POST"])
def my_vehicle(user_id):

    if request.method == 'GET':
        if not User.query.filter_by(id=user_id).first():
            return {"error": "user not found"}, 404
        if not Vehicle.query.filter_by(vehicle_owner_id=user_id).first():
            # return message user has no vehicle
            return jsonify({}), 200
        vehicles = {}
        for item in Vehicle.query.filter_by(vehicle_owner_id=user_id).all():
            vehicles[item.id] = item.to_json()
        return jsonify(vehicles), 200
    elif request.method == 'POST':
        vehicle_info = request.get_json()
        # {vehicle_license_plate:{vehicle_type_id:_, vehicle_height:_, vehicle_width:_, vehicle_length:_}, ...}
        # update vehicle table by vehicle_info: vehicle_license_plate, vehicle_type_id, vehicle_height, vehicle_width, vehicle_length
        user_role = Role.query.filter_by(id=User.query.filter_by(id=user_id).first().role_id).first().role_name
        if user_role != 'admin':
            if vehicle_info:
                for item in vehicle_info.keys():
                    # if item not in vehicle table, add it
                    if not Vehicle.query.filter_by(vehicle_license_plate=item).first():
                        new_vehicle = Vehicle(vehicle_license_plate=item, vehicle_type_id=vehicle_info[item]['vehicle_type_id'],
                                              vehicle_height=vehicle_info[item]['vehicle_height'],
                                              vehicle_width=vehicle_info[item]['vehicle_width'],
                                              vehicle_length=vehicle_info[item]['vehicle_length'],
                                              vehicle_owner_id=user_id)
                        db.session.add(new_vehicle)
                        db.session.commit()
                    # if item in vehicle table, update it
                    else:
                        vehicle = Vehicle.query.filter_by(vehicle_license_plate=item).first()
                        vehicle.vehicle_type_id = vehicle_info[item]['vehicle_type_id']
                        vehicle.vehicle_height = vehicle_info[item]['vehicle_height']
                        vehicle.vehicle_width = vehicle_info[item]['vehicle_width']
                        vehicle.vehicle_length = vehicle_info[item]['vehicle_length']
                        db.session.commit()
                return jsonify({}), 200
            else:
                return {"error": "no vehicle info"}, 404

@profile_bp.route('/my_space/<int:usr_id>', methods=["GET", "POST"])
def my_space(user_id):
    if request.method == 'GET':
        if not User.query.filter_by(id=user_id).first():
            return {"error": "user not found"}, 404
        if not Parking_space.query.filter_by(parking_space_owner_id=user_id).first():
            # return message user has no space
            return jsonify({}), 200
        spaces = {}
        for item in Parking_space.query.filter_by(parking_space_owner_id=user_id).all():
            spaces[item.id] = item.to_json()
        return jsonify(spaces), 200
    if request.method == 'POST':
        space_info = request.get_json()
        # {{parking_space_address:{parking_space_type_id:_, parking_space_height:_, parking_space_width:_, parking_space_length:_}, ...}
        # update parking_space table by space_info: parking_space_address, parking_space_type_id, parking_space_height, parking_space_width, parking_space_length
        user_role = Role.query.filter_by(id=User.query.filter_by(id=user_id).first().role_id).first().role_name
        if user_role != 'admin':
            if space_info:
                for item in space_info.keys():
                    # if item not in parking_space table, add it
                    if not Parking_space.query.filter_by(parking_space_address=item).first():
                        new_space = Parking_space(parking_space_address=item,
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
                        db.session.add(new_space)
                        db.session.commit()
                    # if item in parking_space table, update it
                    else:
                        parking_space = Parking_space.query.filter_by(parking_space_address=item).first()
                        # parking_space = Parking_space.query.filter_by(parking_space_address=item['parking_space_address']).first()
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
                return jsonify({}), 200
            else:
                return {"error": "no space info"}, 404






