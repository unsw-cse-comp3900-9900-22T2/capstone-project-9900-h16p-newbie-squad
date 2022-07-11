from . import car_bp
from flask import request,g
from .. import db
from ..models import Vehicle
import copy


@car_bp.route('/mycar', methods=["GET"])
def mycar():
    curr_user=g.curr_user

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


@car_bp.route('/mycar/new', methods=["POST"])
def createNewCar():
    curr_user=g.curr_user

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


@car_bp.route('/mycar/<string:plate>', methods=["DELETE"])
def deleteCar(plate):
    curr_user=g.curr_user

    car_to_delete=Vehicle.query.filter_by(plate_number=plate).first()
    
    if car_to_delete==None:
        return {'error':'no such car'},400
    
    try:
        db.session.delete(car_to_delete)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200