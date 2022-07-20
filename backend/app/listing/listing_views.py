from . import listing_bp
from ..models import Listing


@listing_bp.route("/listings",methods=['GET'])
def getListings():
    listings=[]
    for each_listing in Listing.query.all():
        parking_space=each_listing.parking_space
        listing={
            "listing_id":each_listing.id,
            "start_date":each_listing.start_date.strftime('%Y-%m-%d'),
            "end_date":each_listing.end_date.strftime('%Y-%m-%d'),
            "published_time":each_listing.published_time.strftime('%Y-%m-%d,%H-%M-%S'),
            "street":parking_space.street,
            "suburb":parking_space.suburb,
            "state":parking_space.state,
            "postcode":parking_space.postcode,
            "latitude":parking_space.latitude,
            "longitude":parking_space.longitude,
            "width":parking_space.width,
            "length":parking_space.length,
            "price":parking_space.price
        }
        listings.append(listing)
        
    return {"all_listings":listings},200


@listing_bp.route("/listings/<int:listing_id>",methods=['GET'])
def getSpecificListings(listing_id):
    listing=Listing.query.filter_by(id=listing_id).first()
    if not listing:
        return {"message":"Listing not found"},400
    parking_space = listing.parking_space
    return_listing = {
        "listing_id": listing.id,
        "start_date": listing.start_date.strftime('%Y-%m-%d'),
        "end_date": listing.end_date.strftime('%Y-%m-%d'),
        "published_time": listing.published_time.strftime('%Y-%m-%d,%H-%M-%S'),
        "street": parking_space.street,
        "suburb": parking_space.suburb,
        "state": parking_space.state,
        "postcode": parking_space.postcode,
        "latitude": parking_space.latitude,
        "longitude": parking_space.longitude,
        "width": parking_space.width,
        "length": parking_space.length,
        "price": parking_space.price
    }

    return return_listing, 200
