from . import request_bp
from flask import request, g
from .. import db
from ..models import Available_Period, Status, Request, Offer
from datetime import datetime
import base64


@request_bp.route('/myrequest', methods=['GET'])
def myRequests():
    curr_user = g.curr_user

    all_requests = []

    # 返回所有的request
    # for each_request in Request.query.filter_by(owner=curr_user).all():

    for each_request in Request.query.filter_by(owner=curr_user).all():
        #           "id":each_request.id,
        #           "owner":each_request.owner.username,
        # 		    "street":"15 eden street",
        # 		    "suburb":"north sydney",
        # 		    "state":"NSW",
        # 		    "postcode":2060,
        # 		    "latitude":"hello123",
        # 		    "longitude":"world456",
        # 		    "budget":350,
        # 		    "start_date":"2022-11-7",
        # 		    "end_date":"2022-11-29"
        # 		    "others": "long text"(这里为文本可以储存一段话）
        # 		    "complete": False
        result = {
            "id": each_request.id,
            "owner": each_request.owner.username,
            "street": each_request.request.street,
            "suburb": each_request.request.suburb,
            "state": each_request.request.state,
            "postcode": each_request.request.postcode,
            "latitude": each_request.request.latitude,
            "longitude": each_request.request.longitude,
            "budget": each_request.budget,
            "start_date": each_request.start_date,
            "end_date": each_request.end_date,
            "others": each_request.others,
            "complete": each_request.complete
        }

        all_requests.append(result)

    return {"all_requests": all_requests}, 200


@request_bp.route('/myrequest/new', methods=['POST'])
def myRequestNew():
    curr_user = g.curr_user
    request_data = request.get_json()

    #             "id": each_request.id,
    #             "owner": each_request.owner.username,
    #             "street": each_request.request.street,
    #             "suburb": each_request.request.suburb,
    #             "state": each_request.request.state,
    #             "postcode": each_request.request.postcode,
    #             "latitude": each_request.request.latitude,
    #             "longitude": each_request.request.longitude,
    #             "budget": each_request.budget,
    #             "start_date": each_request.start_date,
    #             "end_date": each_request.end_date,
    #             "others": each_request.others,
    #             "complete": each_request.complete
    try:
        new_request = Request(
            owner=curr_user,
            street=request_data.get('street'),
            suburb=request_data.get('suburb'),
            state=request_data.get('state'),
            postcode=request_data.get('postcode'),
            latitude=request_data.get('latitude'),
            longitude=request_data.get('longitude'),
            budget=request_data.get('budget'),
            start_date=request_data.get('start_date'),
            end_date=request_data.get('end_date'),
            others=request_data.get('others'),
            complete=False,
            is_active=True
        )
        db.session.add(new_request)
        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    new_request_id = Request.query.all()[-1].id

    return {'new_request_id': new_request_id}, 200


@request_bp.route('/myrequest/<int:request_id>', methods=['GET'])
def getRequest(request_id):
    curr_user = g.curr_user
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400

    #     #             "id": each_request.id,
    #     #             "owner": each_request.owner.username,
    #     #             "street": each_request.request.street,
    #     #             "suburb": each_request.request.suburb,
    #     #             "state": each_request.request.state,
    #     #             "postcode": each_request.request.postcode,
    #     #             "latitude": each_request.request.latitude,
    #     #             "longitude": each_request.request.longitude,
    #     #             "budget": each_request.budget,
    #     #             "start_date": each_request.start_date,
    #     #             "end_date": each_request.end_date,
    #     #             "others": each_request.others,
    #     #             "complete": each_request.complete
    detail = {"id": target_request.id,
              "owner": curr_user.username,
              "street": target_request.street,
              "suburb": target_request.suburb,
              "state": target_request.state,
              "postcode": target_request.postcode,
              "latitude": target_request.latitude,
              "longitude": target_request.longitude,
              "budget": target_request.budget,
              "start_date": target_request.start_date,
              "end_date": target_request.end_date,
              "others": target_request.others,
              "complete": target_request.complete
    }

    return detail, 200


@request_bp.route('/myrequest/<int:request_id>', methods=['DELETE'])
def deleteRequest(request_id):
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400
    if target_request.complete == True:
        return {'message': 'locked request'}, 200
    try:
        target_request.is_active = False
        db.session.add(target_request)
        db.session.commit()
    except:
        return {'error': 'db internal error'}

    return {}, 200


@request_bp.route('/myrequest/<int:request_id>', methods=['PUT'])
def updateRequest(request_id):
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400
    if target_request.complete == True:
        return {'message': 'locked request'}, 200
    info_to_update = request.get_json()
    #             "id": each_request.id,
    #             "owner": each_request.owner.username,
    #             "street": each_request.request.street,
    #             "suburb": each_request.request.suburb,
    #             "state": each_request.request.state,
    #             "postcode": each_request.request.postcode,
    #             "latitude": each_request.request.latitude,
    #             "longitude": each_request.request.longitude,
    #             "budget": each_request.budget,
    #             "start_date": each_request.start_date,
    #             "end_date": each_request.end_date,
    #             "others": each_request.others,
    #             "complete": each_request.complete

    if info_to_update.get('street'):
        target_request.street = info_to_update['street']
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
        target_request.start_date = info_to_update['start_date']
    if info_to_update.get('end_date'):
        target_request.end_date = info_to_update['end_date']
    if info_to_update.get('others'):
        target_request.others = info_to_update['others']

    db.session.add(target_request)
    db.session.commit()

    return {}, 200


@request_bp.route('/myrequest/publish/<int:request_id>', methods=['PUT'])
def publishRequest(request_id):
    request_data = request.get_json()
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'request not found'}, 400

    try:
        new_available_period = Available_Period(start_date=start_date, end_date=end_date, \
                                                request=target_request)
        db.session.add(new_available_period)
        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    return {}, 200


@request_bp.route('/myrequest/unpublish/<int:request_id>', methods=['PUT'])
def unpublishRequest(request_id):
    try:
        target_request = Request.query.filter_by(id=request_id).first()
        if target_request == None: return {'error': 'invalid request'}, 400

        for each_available_period in target_request.available_periods:
            db.session.delete(each_available_period)

        for each_booking in target_request.bookings:
            if each_booking.status == Status.Accepted_Payment_Required:
                each_booking.status = Status.Cancelled
                db.session.add(each_booking)

        db.session.commit()
    except:
        return {'error': 'internal error'}, 400

    return {}, 200



# offer part ---------------------------------------------------------------

@request_bp.route('/myrequest/myoffer/<int:request_id>', methods=['GET'])
def getMyOffer(request_id):
    curr_user = g.curr_user
    myoffers = []
    for eachOfMyRequest in Offer.query.filter_by(owner=curr_user, request=request_id).all():
        #     id = db.Column(db.Integer, primary_key=True)
        #     # 一对多，多的那一侧
        #     request_id = db.Column(db.Integer, db.ForeignKey('requests.id'))
        #     # 一对多，多的那一侧
        #     owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
        #     street = db.Column(db.String(32), nullable=False)
        #     suburb = db.Column(db.String(32), nullable=False)
        #     state = db.Column(db.String(32), nullable=False)
        #     postcode = db.Column(db.Integer, nullable=False)
        #     price = db.Column(db.Float, nullable=True)
        #     comments = db.Column(db.Text)
        #     #如果is_active为假，则代表此offer已经被用户删除
        #     is_active=db.Column(db.Boolean,nullable=False)
        myoffers.append({
            'id': eachOfMyRequest.id,
            'request_id': eachOfMyRequest.request.id,
            'owner_id': eachOfMyRequest.owner.id,
            'street': eachOfMyRequest.street,
            'suburb': eachOfMyRequest.suburb,
            'state': eachOfMyRequest.state,
            'postcode': eachOfMyRequest.postcode,
            'price': eachOfMyRequest.price,
            'comments': eachOfMyRequest.comments,
            'is_active': eachOfMyRequest.is_active,
            'accept': eachOfMyRequest.accept
        })

    return {'myoffers': myoffers}, 200



@request_bp.route("/myrequest/myoffer/new/<int:request_id>",methods=['PUT'])
def myOfferNew(request_id):
    curr_user=g.curr_user
    offer_data = request.get_json()
    #     request_id = db.Column(db.Integer, db.ForeignKey('requests.id'))
    #     # 一对多，多的那一侧
    #     owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    #     street = db.Column(db.String(32), nullable=False)
    #     suburb = db.Column(db.String(32), nullable=False)
    #     state = db.Column(db.String(32), nullable=False)
    #     postcode = db.Column(db.Integer, nullable=False)
    #     price = db.Column(db.Float, nullable=True)
    #     comments = db.Column(db.Text)
    #     #如果is_active为假，则代表此offer已经被用户删除
    #     is_active=db.Column(db.Boolean,nullable=False)
    #     accept = db.Column(db.Boolean, nullable=False)
    try:
        new_offer = Offer(
            request=request_id,
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


@request_bp.route('/myrequest/myoffer/<int:request_id>', methods=['DELETE'])
def deleteOffer(request_id):
    curr_user = g.curr_user
    for each_offer in Offer.query.filter_by(owner=curr_user, request=request_id).all():
        # target_request = Request.query.filter_by(id=request_id).first()
        if each_offer == None or each_offer.is_active == False:
            return {'error': 'invalid request'}, 400
        try:
            each_offer.is_active = False
            db.session.add(each_offer)
            db.session.commit()
        except:
            return {'error': 'db internal error'}

    return {}, 200

@request_bp.route('/myrequest/offers', methods=['GET'])
def getOffers():
    curr_user = g.curr_user
    offers = []
    for each_request in Request.query.filter_by(owner=curr_user).all():
        for each_offer in Offer.query.filter_by(request = each_request.id).all():
            if each_offer.is_active == True:
                offers.append({
                    'id': each_offer.id,
                    'request_id': each_offer.request.id,
                    'owner_id': each_offer.owner.id,
                    'street': each_offer.street,
                    'suburb': each_offer.suburb,
                    'state': each_offer.state,
                    'postcode': each_offer.postcode,
                    'price': each_offer.price,
                    'comments': each_offer.comments,
                    'is_active': each_offer.is_active,
                    'accept': each_offer.accept
                })

    return {'offers':offers},200
