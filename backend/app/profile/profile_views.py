from turtle import width
from . import profile_bp

from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request,render_template, redirect, session,url_for,jsonify,current_app

from .. import db
from ..models import Role, User, Vehicle, Parking_space,Parking_time_range

import copy

@profile_bp.route('/profile',methods=["GET", "POST"])
def profile():
    request_headers_json=request.headers
    request_token=request_headers_json.get('token')

    try:
        user_id=User.verify_auth_token(request_token)
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if(curr_user==None):
        return {'error':'no such user'},400

    curr_user_role=Role.query.filter_by(id=curr_user.role_id).first().role_name

    curr_user_dict={
        'username':curr_user.username,
        'email':curr_user.email,
        'phone_num':curr_user.phone_num,
        'bank_account':curr_user.bank_account,
        'avatar':curr_user.avatar,
        'bio':curr_user.bio,
        'role':curr_user_role
    }

    #从现在开始，token已经验证完成，这个用户是一个有效的用户

    if request.method == 'GET':
        return curr_user_dict, 200

    elif request.method == 'POST':
        #暂时不用判断是否是admin
        #role暂时不可修改
        #username是否可以修改待定，目前先做成可以修改

        info_to_update = request.get_json()

        if info_to_update.get('username'):
            curr_user.username = info_to_update['username']
        if info_to_update.get('email'):
            curr_user.email = info_to_update['email']
        if info_to_update.get('phone_num'):
            curr_user.phone_num = info_to_update['phone_num']
        if info_to_update.get('bank_account'):
            curr_user.bank_account = info_to_update['bank_account']
        if info_to_update.get('avatar'):
            curr_user.avatar = info_to_update['avatar']
        if info_to_update.get('bio'):
            curr_user.bio = info_to_update['bio']

        db.session.add(curr_user)
        db.session.commit()
        return {}, 200


@profile_bp.route('/mycar', methods=["GET"])
def mycar():
    request_token=request.headers.get('token')
    print(request_token)

    try:
        user_id=User.verify_auth_token(request_token)
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if(curr_user==None):
        return {'error':'no such user'},400
    

    mycars=[]
    for each_car in Vehicle.query.filter_by(owner_id=curr_user.id).all():
        car_info={
            "id":each_car.id,
            "plate_number":each_car.plate_number,
            "brand":each_car.brand,
            "width":each_car.width,
            "length":each_car.length
        }
        mycars.append(copy.deepcopy(car_info))
    
    return {'mycars':mycars},200


    
@profile_bp.route('/mycar/new', methods=["POST"])
def createNewCar():
    request_token=request.headers.get('token')

    try:
        user_id=User.verify_auth_token(request_token)
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if(curr_user==None):
        return {'error':'no such user'},400

    new_car_info=request.get_json()

    try:
        new_car=Vehicle(
            user=curr_user,
            plate_number=new_car_info.get('plate_number'),brand=new_car_info.get('brand'),\
            width=new_car_info.get('width'),length=new_car_info.get('length')
        )

        db.session.add(new_car)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    new_car_id=Vehicle.query.filter_by(plate_number=new_car_info.get('plate_number')).first().id

    return {'new_car_id':new_car_id},200



@profile_bp.route('/mycar/<string:plate>', methods=["DELETE"])
def deleteCar(plate):
    request_token=request.headers.get('token')

    try:
        user_id=User.verify_auth_token(request_token)
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if(curr_user==None):
        return {'error':'no such user'},400

    car_to_delete=Vehicle.query.filter_by(plate_number=plate).first()
    
    if car_to_delete==None:
        return {'error':'no such car'},400
    
    try:
        db.session.delete(car_to_delete)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200



@profile_bp.route('/mycarspacelisting',methods=['GET'])
def mycarspacelisting():
    request_token=request.headers.get('token')

    try:
        user_id=User.verify_auth_token(request_token)
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if curr_user==None:
        return {'error':'no such user'},400

    all_listings=[]

    for each_car_space in Parking_space.query.filter_by(user=curr_user).all():
        for each_listing in Parking_time_range.query.filter_by(parking_space=each_car_space):
            all_listings.append(
                {
                    "id":each_car_space.id,
                    "owner":curr_user.username,
                    "address":each_car_space.address,
                    "width":each_car_space.width,
                    "length":each_car_space.length,
                    "price":each_car_space.price,
                    "start_date":each_listing.start_date,
                    "end_date":each_listing.end_date
                }
            )
    
    for each_car_space in Parking_space.query.filter_by(user=curr_user).all():
        if Parking_time_range.query.filter_by(parking_space=each_car_space).first()==None:
            all_listings.append(
                {
                    "id":each_car_space.id,
                    "owner":curr_user.username,
                    "address":each_car_space.address,
                    "width":each_car_space.width,
                    "length":each_car_space.length,
                    "price":each_car_space.price,
                    "start_date":"Not published",
                    "end_date":"Not published"
                }
            )

    print(all_listings)

    return {"all_listings":all_listings},200



@profile_bp.route('/mycarspacelisting/new',methods=['POST'])
def mycarspacelistingNew():
    try:
        user_id=User.verify_auth_token(request.headers.get('token'))
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if curr_user==None:
        return {'error':'no such user'},400

    request_data=request.get_json()

    #由于已经验证过token，因此我们能确保现在的HTTP请求是从可信用户处发送的，因此格式符合要求
    #不再验证格式

    try:
        new_parking_space=Parking_space(
            user=curr_user,address=request_data.get('address'),width=request_data.get('width'),\
                length=request_data.get('length'),price=request_data.get('price')
        )
        db.session.add(new_parking_space)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    new_carspace_id=Parking_space.query.all()[-1].id

    return {'new_carspace_id':new_carspace_id},200




@profile_bp.route('/mycarspacelisting/publish/<int:carspace_id>',methods=['PUT'])
def publishCarSpace(carspace_id):
    try:
        user_id=User.verify_auth_token(request.headers.get('token'))
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if curr_user==None: return {'error':'no such user'},400

    request_data=request.get_json()
    curr_carspace=Parking_space.query.filter_by(id=carspace_id).first()

    if curr_carspace==None:
        return {'error':'carspace not found'},400

    try:
        new_listing=Parking_time_range(start_date=request_data.get('start_date'),\
            end_date=request_data.get('end_date'),parking_space=curr_carspace)
        
        db.session.add(new_listing)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    new_listing_id=Parking_time_range.query.all()[-1].id

    return {'new_listing_id':new_listing_id},200



@profile_bp.route('/mycarspacelisting/unpublish/<int:carspace_id>',methods=['PUT'])
def unpublishCarSpace(carspace_id):
    try:
        user_id=User.verify_auth_token(request.headers.get('token'))
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if curr_user==None: return {'error':'no such user'},400

    all_listings=Parking_time_range.query.filter_by(parking_space_id=carspace_id).all()

    try:
        for each_listing in all_listings:
            db.session.delete(each_listing)
    except:
        return {'error':'internal error'},400

    db.session.commit()
    
    return {},200







'''
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

'''




