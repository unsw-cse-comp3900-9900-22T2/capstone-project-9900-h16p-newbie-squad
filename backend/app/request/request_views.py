from . import request_bp
from flask import request, g
from .. import db
from ..models import Available_Period, Status, Request, Offer, Billing, User, Credit_card, Bank_account
from datetime import datetime
import base64


# return my reqeust is_active=True
@request_bp.route('/myrequest', methods=['GET'])
def myRequests():
    curr_user = g.curr_user

    all_requests = []

    # for each_request in Request.query.filter_by(owner=curr_user).all():

    for each_request in Request.query.filter_by(owner=curr_user, is_active=True).all():
        result = {
            "id": each_request.id,
            "owner": each_request.owner_id,
            "title": each_request.title,
            "street": each_request.street,
            "suburb": each_request.suburb,
            "state": each_request.state,
            "postcode": each_request.postcode,
            "latitude": each_request.latitude,
            "longitude": each_request.longitude,
            "budget": each_request.budget,
            "start_date": each_request.start_date.strftime('%Y-%m-%d'),
            "end_date": each_request.end_date.strftime('%Y-%m-%d'),
            "others": each_request.others,
            "complete": each_request.complete,
            "is_active": each_request.is_active,
            "publish": each_request.publish
        }

        all_requests.append(result)

    return {"all_requests": all_requests}, 200


# create reqeust
@request_bp.route('/myrequest/new', methods=['POST'])
def myRequestNew():
    curr_user = g.curr_user
    request_data = request.get_json()
    try:
        _start_date = datetime.strptime(request_data.get('start_date'), '%Y-%m-%d').date()
        _end_date = datetime.strptime(request_data.get('end_date'), '%Y-%m-%d').date()
    except:
        return {'error': 'invalid time format'}, 400

    try:
        new_request = Request(
            owner=curr_user,
            title=request_data.get('title'),
            street=request_data.get('street'),
            suburb=request_data.get('suburb'),
            state=request_data.get('state'),
            postcode=request_data.get('postcode'),
            latitude=request_data.get('latitude'),
            longitude=request_data.get('longitude'),
            budget=request_data.get('budget'),
            start_date=_start_date,
            end_date=_end_date,
            others=request_data.get('others'),
            complete=False,
            is_active=True,
            publish=True
        )
        db.session.add(new_request)
        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    new_request_id = Request.query.all()[-1].id

    return {'new_request_id': new_request_id}, 200


# return reqeust
@request_bp.route('/myrequest/<int:request_id>', methods=['GET'])
def getRequest(request_id):
    curr_user = g.curr_user
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400

    detail = {
        "id": target_request.id,
        "owner": target_request.owner_id,
        "title": target_request.title,
        "street": target_request.street,
        "suburb": target_request.suburb,
        "state": target_request.state,
        "postcode": target_request.postcode,
        "latitude": target_request.latitude,
        "longitude": target_request.longitude,
        "budget": target_request.budget,
        "start_date": target_request.start_date.strftime('%Y-%m-%d'),
        "end_date": target_request.end_date.strftime('%Y-%m-%d'),
        "others": target_request.others,
        "complete": target_request.complete,
        "is_active": target_request.is_active,
        "publish": target_request.publish
    }

    return detail, 200


# delete request
@request_bp.route('/myrequest/delete/<int:request_id>', methods=['DELETE'])
def deleteRequest(request_id):
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400
    if target_request.complete == True:
        return {'error': 'locked request'}, 400
    try:
        target_request.is_active = False
        db.session.add(target_request)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400

    return {}, 200


# update reqeust
@request_bp.route('/myrequest/update/<int:request_id>', methods=['PUT'])
def updateRequest(request_id):
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400
    if target_request.complete == True:
        return {'error': 'locked request'}, 400
    info_to_update = request.get_json()

    if info_to_update.get('street'):
        target_request.street = info_to_update['street']
    if info_to_update.get('title'):
        target_request.title = info_to_update['title']
    if info_to_update.get('suburb'):
        target_request.suburb = info_to_update['suburb']
    if info_to_update.get('state'):
        target_request.state = info_to_update['state']
    if info_to_update.get('postcode'):
        target_request.postcode = info_to_update['postcode']
    if info_to_update.get('latitude'):
        target_request.latitude = info_to_update['latitude']
    if info_to_update.get('longitude'):
        target_request.longitude = info_to_update['longitude']
    if info_to_update.get('budget'):
        target_request.budget = info_to_update['budget']
    if info_to_update.get('start_date'):
        try:
            _start_date = datetime.strptime(info_to_update.get('start_date'), '%Y-%m-%d').date()
            # _start_date = datetime.strptime(info_to_update['start_date'], '%Y-%m-%d').date()
            target_request.start_date = _start_date
        except:
            return {'error': 'invalid time format'}, 400
    if info_to_update.get('end_date'):
        try:
            _end_date = datetime.strptime(info_to_update.get('end_date'), '%Y-%m-%d').date()
            # _end_date = datetime.strptime(info_to_update['end_date'], '%Y-%m-%d').date()
            target_request.end_date = _end_date
        except:
            return {'error': 'invalid time format'}, 400
    if info_to_update.get('others'):
        target_request.others = info_to_update['others']

    db.session.add(target_request)
    db.session.commit()

    return {}, 200

# set a request publish == True
@request_bp.route('/myrequest/publish/<int:request_id>', methods=['POST'])
def publishRequest(request_id):
    # request_data = request.get_json()
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'request not found'}, 400

    try:
        target_request.publish = True
        db.session.add(target_request)
        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    return {}, 200


# set a request to be not published
@request_bp.route('/myrequest/unpublish/<int:request_id>', methods=['POST'])
def unpublishRequest(request_id):
    # request_data = request.get_json()
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'request not found'}, 400
    if target_request.complete == True:
        return {'error': 'locked request'}, 400

    try:
        target_request.publish = False
        db.session.add(target_request)
        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    return {}, 200



# return request is_active == True, publish == True
@request_bp.route('/myrequest/published_requests', methods=['GET'])
def publishedRequests():

    all_requests = []

    for each_request in Request.query.filter_by(is_active=True, publish=True, complete = False).all():
        result = {
            "id": each_request.id,
            "owner": each_request.owner_id,
            "title": each_request.title,
            "street": each_request.street,
            "suburb": each_request.suburb,
            "state": each_request.state,
            "postcode": each_request.postcode,
            "latitude": each_request.latitude,
            "longitude": each_request.longitude,
            "budget": each_request.budget,
            "start_date": each_request.start_date.strftime('%Y-%m-%d'),
            "end_date": each_request.end_date.strftime('%Y-%m-%d'),
            "others": each_request.others,
            "complete": each_request.complete,
            "is_active": each_request.is_active,
            "publish": each_request.publish
        }

        all_requests.append(result)

    return {"all_published_requests": all_requests}, 200


# return request publish == True, is_active == True
@request_bp.route('/myrequest/published_requests/<int:request_id>', methods=['GET'])
def getPublishedRequest(request_id):
    curr_user = g.curr_user
    target_request = Request.query.filter_by(id=request_id, publish=True).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400

    detail = {
        "id": target_request.id,
        "owner": target_request.owner_id,
        "title": target_request.title,
        "street": target_request.street,
        "suburb": target_request.suburb,
        "state": target_request.state,
        "postcode": target_request.postcode,
        "latitude": target_request.latitude,
        "longitude": target_request.longitude,
        "budget": target_request.budget,
        "start_date": target_request.start_date.strftime('%Y-%m-%d'),
        "end_date": target_request.end_date.strftime('%Y-%m-%d'),
        "others": target_request.others,
        "complete": target_request.complete,
        "is_active": target_request.is_active,
        "publish": target_request.publish
    }

    return detail, 200


# offer part ---------------------------------------------------------------

# return all offers for a request
@request_bp.route('/myrequest/myoffer/<int:request_id>', methods=['GET'])
def getMyOffer(request_id):
    curr_user = g.curr_user
    myoffers = []
    target_request = Request.query.filter_by(id=request_id, is_active=True, publish=True).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'request not found'}, 400

    for eachOfMyOffer in Offer.query.filter_by(owner=curr_user, request=target_request).all():

        myoffers.append({
            'id': eachOfMyOffer.id,
            'request_id': eachOfMyOffer.request_id,
            'owner_id': eachOfMyOffer.owner_id,
            'street': eachOfMyOffer.street,
            'suburb': eachOfMyOffer.suburb,
            'state': eachOfMyOffer.state,
            'postcode': eachOfMyOffer.postcode,
            'price': eachOfMyOffer.price,
            'comments': eachOfMyOffer.comments,
            'is_active': eachOfMyOffer.is_active,
            'accept': eachOfMyOffer.accept
        })

    return {'myoffers': myoffers}, 200


# create offer under specific request
@request_bp.route("/myrequest/myoffer/new/<int:request_id>", methods=['PUT'])
def myOfferNew(request_id):
    curr_user = g.curr_user
    offer_data = request.get_json()

    target_request = Request.query.filter_by(id=request_id, is_active=True, publish=True).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'request not found'}, 400
    try:
        new_offer = Offer(
            request=target_request,
            owner=curr_user,
            street=offer_data.get('street'),
            suburb=offer_data.get('suburb'),
            state=offer_data.get('state'),
            postcode=offer_data.get('postcode'),
            price=offer_data.get('price'),
            comments=offer_data.get('comments'),
            is_active=True,
            accept=False
        )
        db.session.add(new_offer)
        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    new_offer_id = Request.query.all()[-1].id

    return {'new_offer_id': new_offer_id}, 200


# delete offer
@request_bp.route('/myrequest/myoffer/delete/<int:offer_id>', methods=['DELETE'])
def deleteOffer(offer_id):
    curr_user = g.curr_user
    target_offer = Offer.query.filter_by(owner=curr_user, id=offer_id).first()
    # target_request = Request.query.filter_by(id=request_id).first()
    if target_offer == None or target_offer.is_active == False:
        return {'error': 'invalid offer'}, 400
    try:
        target_offer.is_active = False
        db.session.add(target_offer)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400

    return {}, 200


# return offer under specific request
@request_bp.route('/myrequest/myoffer/my_reveived_offers/<int:request_id>', methods=['GET'])
def getOffers(request_id):
    curr_user = g.curr_user
    myoffers = []
    accepted_offer_id = []
    target_request = Request.query.filter_by(id=request_id, is_active=True).first()
    if target_request == None:
        return {'error': 'request not found'}, 400
    for eachOfMyOffer in Offer.query.filter_by(request= target_request, is_active=True).all():
        owner_name = User.query.filter_by(id=eachOfMyOffer.owner_id).first().username
        if eachOfMyOffer.accept == True:
            accepted_offer_id.append(eachOfMyOffer.id)
        myoffers.append({
            'id': eachOfMyOffer.id,
            'request_id': eachOfMyOffer.request_id,
            'owner_id': eachOfMyOffer.owner_id,
            'owner_name': owner_name,
            'street': eachOfMyOffer.street,
            'suburb': eachOfMyOffer.suburb,
            'state': eachOfMyOffer.state,
            'postcode': eachOfMyOffer.postcode,
            'price': eachOfMyOffer.price,
            'comments': eachOfMyOffer.comments,
            'is_active': eachOfMyOffer.is_active,
            'accept': eachOfMyOffer.accept
        })

    return{'received offers': myoffers,"accepted offers": accepted_offer_id},200
    # return {'received offers': myoffers}, 200


# accept offer, close request
@request_bp.route('/myrequest/myoffer/accept_offer/<int:offer_id>', methods=['POST'])
def acceptOffer(offer_id):
    curr_user = g.curr_user
    if curr_user == None:
        check_current_user = False
    else:
        check_current_user = True
    target_offer = Offer.query.filter_by(id=offer_id, is_active=True).first()
    if target_offer == None:
        return {'error': 'offer not found'}, 400
    target_request = Request.query.filter_by(id=target_offer.request_id, is_active=True).first()
    if target_request == None:
        return {'error': 'request not found'}, 400
    if target_request.complete == True:
        return {'message': 'request already completed'}, 200
    try:
        target_offer.accept = True
        db.session.add(target_offer)

        target_request.complete = True
        db.session.add(target_request)
        db.session.commit()
        return {'message': 'ok'}, 200
    except:
        return {'error': 'db internal error'}, 400

