from . import billing_bp
from flask import request, g
from .. import db
from ..models import Billing
import copy
from ..models import Role, User, Vehicle, Bank_account, Credit_card


@billing_bp.route('/billing/mybillings', methods=["GET"])
def myBillings():
    curr_user=g.curr_user

    customer_billings = []
    for each_billing in Billing.query.filter_by(customer_id=curr_user.id).all():
        billing_info = {
            "id": each_billing.id,
            "provider_id": each_billing.provider_id,
            "customer_id": each_billing.customer_id,
            "provider_name": each_billing.provider_name,
            "customer_name": each_billing.customer_name,
            "address": each_billing.address,
            "start_date": each_billing.start_date.strftime('%Y-%m-%d'),
            "end_date": each_billing.end_date.strftime('%Y-%m-%d'),
            "unit_price": each_billing.unit_price,
            "total_price": each_billing.total_price,
            "rent_fee": each_billing.rent_fee,
            "service_fee": each_billing.service_fee,
            "payment_time": each_billing.payment_time,
            "customer_card_number": each_billing.customer_card_number,
            "provider_bank_account": each_billing.provider_bank_account
        }
        customer_billings.append(copy.deepcopy(billing_info))

    provider_billings = []

    for each_billing in Billing.query.filter_by(provider_id=curr_user.id).all():
        billing_info = {
            "id": each_billing.id,
            "provider_id": each_billing.provider_id,
            "customer_id": each_billing.customer_id,
            "provider_name": each_billing.provider_name,
            "customer_name": each_billing.customer_name,
            "address": each_billing.address,
            "start_date": each_billing.start_date.strftime('%Y-%m-%d'),
            "end_date": each_billing.end_date.strftime('%Y-%m-%d'),
            "unit_price": each_billing.unit_price,
            "total_price": each_billing.total_price,
            "rent_fee": each_billing.rent_fee,
            "service_fee": each_billing.service_fee,
            "payment_time": each_billing.payment_time,
            "customer_card_number": each_billing.customer_card_number,
            "provider_bank_account": each_billing.provider_bank_account
        }

        provider_billings.append(copy.deepcopy(billing_info))


    return {'customer_billings': customer_billings, 'provider_billings': provider_billings}, 200



@billing_bp.route('/billing/<int:billing_id>', methods=["GET"])
def getSpecificBilling(billing_id):
    curr_user=g.curr_user

    billing = Billing.query.filter_by(id=billing_id).first()
    if not billing:
        return {'error': 'Billing not found'}, 400
    return_dict = {
        "id": billing.id,
        "provider_id": billing.provider_id,
        "customer_id": billing.customer_id,
        "provider_name": billing.provider_name,
        "customer_name": billing.customer_name,
        "address": billing.address,
        "start_date": billing.start_date.strftime('%Y-%m-%d'),
        "end_date": billing.end_date.strftime('%Y-%m-%d'),
        "unit_price": billing.unit_price,
        "total_price": billing.total_price,
        "rent_fee": billing.rent_fee,
        "service_fee": billing.service_fee,
        "payment_time": billing.payment_time,
        "customer_card_number": billing.customer_card_number,
        "provider_bank_account": billing.provider_bank_account
    }
    return return_dict, 200



@billing_bp.route('/profile/bank_account',methods=["GET", "POST"])
def myBankAccount():
    curr_user=g.curr_user

    curr_bank_account = Bank_account.query.filter_by(owner=curr_user).first()
    if request.method == 'GET':
        if not curr_bank_account:
            return {}, 200
        return_dict = {
            "account_id": curr_bank_account.account_id,
            "owner_id": curr_bank_account.owner_id,
            "account_name": curr_bank_account.account_name,
            "bsb": curr_bank_account.bsb
        }
        return return_dict, 200

    elif request.method == 'POST':
        info_to_update = request.get_json()
        if not curr_bank_account:
            try:
                new_bank_account = Bank_account(
                    account_id=info_to_update['account_id'],
                    owner_id=curr_user.id,
                    account_name=info_to_update['account_name'],
                    bsb=info_to_update['bsb']
                )
                db.session.add(new_bank_account)
                db.session.commit()
                return {'message': 'update success'}, 200
            except:
                return {'error': 'Invalid input'}, 400

        if info_to_update.get('account_id'):
            curr_bank_account.account_id = info_to_update.get('account_id')
        if info_to_update.get('account_name'):
            curr_bank_account.account_name = info_to_update.get('account_name')
        if info_to_update.get('bsb'):
            curr_bank_account.bsb = info_to_update.get('bsb')

        db.session.add(curr_bank_account)
        db.session.commit()
        return {'message': 'update success'}, 200


@billing_bp.route('/profile/credit_card',methods=["GET", "POST"])
def myCreditCard():
    curr_user=g.curr_user

    curr_credit_card = Credit_card.query.filter_by(owner=curr_user).first()

    if request.method == 'GET':
        if not curr_credit_card:
            return {}, 200
        return_dict = {
            "owner_id": curr_credit_card.owner_id,
            "card_number": curr_credit_card.card_number,
            "card_name": curr_credit_card.card_name,
            "expiry_date": curr_credit_card.expiry_date,
            "cvv": curr_credit_card.cvv
        }
        return return_dict, 200
    elif request.method == 'POST':
        info_to_update = request.get_json()
        if not curr_credit_card:
            # add new credit card manually
            try:
                new_credit_card = Credit_card(
                    owner_id=curr_user.id,
                    card_number=info_to_update.get('card_number'),
                    card_name=info_to_update.get('card_name'),
                    expiry_date=info_to_update.get('expiry_date'),
                    cvv=info_to_update.get('cvv')
                )
                db.session.add(new_credit_card)
                db.session.commit()
                return {'message': 'update success'}, 200
            except:
                return {'error': 'Invalid input'}, 400

        if info_to_update.get('card_number'):
            curr_credit_card.card_number = info_to_update.get('card_number')
        if info_to_update.get('card_name'):
            curr_credit_card.card_name = info_to_update.get('card_name')
        if info_to_update.get('expiry_date'):
            curr_credit_card.expiry_date = info_to_update.get('expiry_date')
        if info_to_update.get('cvv'):
            curr_credit_card.cvv = info_to_update.get('cvv')
        db.session.add(curr_credit_card)
        db.session.commit()
        return {'message': 'update success'}, 200
