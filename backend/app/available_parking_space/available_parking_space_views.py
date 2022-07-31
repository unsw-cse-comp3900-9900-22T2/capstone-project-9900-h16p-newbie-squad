from . import available_parking_space_bp
from ..models import Parking_space


@available_parking_space_bp.route("/available_parking_spaces",methods=['GET'])
def get_available_parking_spaces():
    available_parking_spaces=[]
    
    for each_available_parking_space in Parking_space.query.filter_by(is_active=True).all():
        available_parking_space={
            "parking_space_id":each_available_parking_space.id,
            "street":each_available_parking_space.street,
            "suburb":each_available_parking_space.suburb,
            "state":each_available_parking_space.state,
            "postcode":each_available_parking_space.postcode,
            "latitude":each_available_parking_space.latitude,
            "longitude":each_available_parking_space.longitude,
            "width":each_available_parking_space.width,
            "length":each_available_parking_space.length,
            "price":each_available_parking_space.price,
            "average_rating":each_available_parking_space.average_rating,
            # "avatar":each_available_parking_space.picture_1
        }
        available_parking_space["avatar"]=(base64.b64encode(each_available_parking_space.picture_1)).decode() if each_available_parking_space.picture_1 else None

        availibility=[]
        for each_available_period in each_available_parking_space.available_periods:
            availibility.append({
                "start_date":each_available_period.start_date.strftime('%Y-%m-%d'),
                "end_date":each_available_period.end_date.strftime('%Y-%m-%d')
            })
        
        if availibility!=[]:
            available_parking_space["availibility"]=availibility
            available_parking_spaces.append(available_parking_space)
        
    return {"available_parking_spaces":available_parking_spaces},200


@available_parking_space_bp.route("/available_parking_spaces/<int:parkingspace_id>",methods=['GET'])
def getSpecificParkingSpace(parkingspace_id):
    target_parking_space=Parking_space.query.filter_by(id=parkingspace_id).first()
    if not target_parking_space: return {"message":"parking space not found"},400
    
    result = {
        "parking_space_id": target_parking_space.id,
        "street": target_parking_space.street,
        "suburb": target_parking_space.suburb,
        "state": target_parking_space.state,
        "postcode": target_parking_space.postcode,
        "latitude": target_parking_space.latitude,
        "longitude": target_parking_space.longitude,
        "width": target_parking_space.width,
        "length": target_parking_space.length,
        "price": target_parking_space.price,
        "average_rating":target_parking_space.average_rating,
        # "picture_1":target_parking_space.picture_1,
        # "picture_2":target_parking_space.picture_2,
        # "picture_3":target_parking_space.picture_3,
    }
    result["picture_1"]=(base64.b64encode(target_parking_space.picture_1)).decode() if target_parking_space.picture_1 else None
    result["picture_2"]=(base64.b64encode(target_parking_space.picture_2)).decode() if target_parking_space.picture_2 else None
    result["picture_3"]=(base64.b64encode(target_parking_space.picture_3)).decode() if target_parking_space.picture_3 else None

    availibility=[]
    for each_available_period in target_parking_space.available_periods:
        availibility.append({
            "start_date":each_available_period.start_date.strftime('%Y-%m-%d'),
            "end_date":each_available_period.end_date.strftime('%Y-%m-%d')
        })
    
    result["availibility"]=availibility

    return result, 200
