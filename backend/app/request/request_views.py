from . import request_bp
from flask import request, g
from .. import db
from ..models import Available_Period, Status, Request, Offer, Billing, User, Credit_card, Bank_account
from datetime import datetime
import base64

# 返回所有我的request，无论is_active, complete, publish 的状态
@request_bp.route('/myrequest', methods=['GET'])
def myRequests():
    curr_user = g.curr_user

    all_requests = []

    # 返回所有的request
    # for each_request in Request.query.filter_by(owner=curr_user).all():

    for each_request in Request.query.filter_by(owner=curr_user).all():
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
            "complete": each_request.complete,
            "is_active": each_request.is_active,
            "publish": each_request.publish
        }

        all_requests.append(result)

    return {"all_requests": all_requests}, 200

# 创建新的request
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

# 根据request id 返回确定的一条request（包括被删除的）
@request_bp.route('/myrequest/<int:request_id>', methods=['GET'])
def getRequest(request_id):
    curr_user = g.curr_user
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None :
        return {'error': 'invalid request'}, 400

    detail = {
            "id": target_request.id,
            "owner": curr_user.username,
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

# 根据request id 删除一条request
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
        return {'error': 'db internal error'},400

    return {}, 200

# 根据request id 更新一条request
@request_bp.route('/myrequest/update/<int:request_id>', methods=['PUT'])
def updateRequest(request_id):
    target_request = Request.query.filter_by(id=request_id).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400
    if target_request.complete == True:
        return {'error': 'locked request'}, 400
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

# 根据 request id 把一个request 的状态设置为publish == True
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

# 根据 request id 把一个request 的状态设置为publish == False
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

# 返回所有is_active == True, publish == True 的 request，
@request_bp.route('/myrequest/published_requests', methods=['GET'])
def publishedRequests():
    all_requests = []

    for each_request in Request.query.filter_by(is_active=True, publish=True).all():
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
            "start_date": each_request.start_date.strftime('%Y-%m-%d'),
            "end_date": each_request.end_date.strftime('%Y-%m-%d'),
            "others": each_request.others,
            "complete": each_request.complete,
            "is_active": each_request.is_active,
            "publish": each_request.publish
        }

        all_requests.append(result)

    return {"all_published_requests": all_requests}, 200

# 根据request id 返回确定的一条publish == True, is_active == True 的request,
@request_bp.route('/myrequest/published_requests/<int:request_id>', methods=['GET'])
def getRequest(request_id):
    curr_user = g.curr_user
    target_request = Request.query.filter_by(id=request_id, publish = True).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'invalid request'}, 400

    detail = {
            "id": target_request.id,
            "owner": curr_user.username,
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
# 返回所有当前用户发布的关于某个request_id 的offer
@request_bp.route('/myrequest/myoffer/<int:request_id>', methods=['GET'])
def getMyOffer(request_id):
    curr_user = g.curr_user
    myoffers = []
    target_request = Request.query.filter_by(id=request_id, is_active=True, publish=True).first()
    if target_request == None or target_request.is_active == False:
        return {'error': 'request not found'}, 400

    for eachOfMyOffer in Offer.query.filter_by(owner=curr_user, request=request_id).all():
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
            'id': eachOfMyOffer.id,
            'request_id': eachOfMyOffer.request.id,
            'owner_id': eachOfMyOffer.owner.id,
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

# 新建关于某个request_id 的offer，并返回offer的id
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

# 根据offer id 删除offer
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
        return {'error': 'db internal error'},400

    return {}, 200


# request发起人，返回某个request下面的所有offer
@request_bp.route('/myrequest/myoffer/my_reveived_offers/<int:request_id>', methods=['GET'])
def getOffers(request_id):

    curr_user = g.curr_user
    myoffers = []
    target_request = Request.query.filter_by(id=request_id, is_active=True).first()
    if target_request == None :
        return {'error': 'request not found'}, 400
    for eachOfMyOffer in Offer.query.filter_by(request=request_id, is_active=True).all():
        myoffers.append({
            'id': eachOfMyOffer.id,
            'request_id': eachOfMyOffer.request.id,
            'owner_id': eachOfMyOffer.owner.id,
            'street': eachOfMyOffer.street,
            'suburb': eachOfMyOffer.suburb,
            'state': eachOfMyOffer.state,
            'postcode': eachOfMyOffer.postcode,
            'price': eachOfMyOffer.price,
            'comments': eachOfMyOffer.comments,
            'is_active': eachOfMyOffer.is_active,
            'accept': eachOfMyOffer.accept
        })

    return {'received offers': myoffers}, 200


# request发起人，接受offer， 并且自己的request关闭， 生成billing
@request_bp.route('/myrequest/myoffer/accept_offer/<int:offer_id>', methods=['POST'])
def acceptOffer(offer_id):

    curr_user = g.curr_user
    target_offer = Offer.query.filter_by(id=offer_id, is_active=True).first()
    if target_offer == None:
        return {'error': 'offer not found'}, 400
    target_request = Request.query.filter_by(owner=curr_user, id=target_offer.request_id, is_active=True).first()
    if target_request == None :
        return {'error': 'request not found'}, 400
    try:
        target_offer.accept = True
        db.session.add(target_offer)
        
        target_request.complete = True
        db.session.add(target_request)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400
    # target_parking_space = ParkingSpace.query.filter_by(id=target_request.parking_space_id, is_active=True).first()
    provider = User.queryy.filter_by(id=target_offer.owner_id).first().username
    customer = User.queryy.filter_by(id=target_request.owner_id).first().username
    address='Address: %s %s %s %s.'%(target_offer.street,target_offer.suburb,\
                                     target_offer.state,target_offer.postcode)

    customer_card = Credit_card.query.filter_by(owner=target_request.owner_id).first().id
    provider_bank = Bank_account.query.filter_by(owner=target_offer.owner_id).first().id
    this_billing=Billing(
        #永久保存订单成功当时的provider和customer的id，便于后面搜索历史订单
        provider_id=target_offer.owner.id,
        customer_id=target_request.owner.id,
        #永久保存订单成功当时的provider和customer的username
        provider_name=provider,
        customer_name=customer,
        #这张表只是存储历史记录，因此address不再分开了，生成历史记录的时候把street，suburb等合成一个字符串
        address=address,
        start_date=target_request.start_date.strftime('%Y-%m-%d'),
        end_date=target_request.end_date.strftime('%Y-%m-%d'),
        unit_price=target_offer.price,
        total_price=target_offer.price,
        #永久保存customer付款时用的银行卡号
        customer_card_number=customer_card,
        #永久保存provider收款时用的账户号
        provider_bank_account=provider_bank
    )

    #向数据库中添加订单历史记录
    db.session.add(this_billing)
    return {}, 200
