from . import billing_bp
from flask import request, g
from .. import db
from ..models import Billing
import copy
from ..models import Role, User, Vehicle, Bank_account, Credit_card

@billing_bp.route('/billing/mybillings', methods=["GET"])
def myBillings():
    curr_user = g.curr_user

    customer_billings = []
    # 自己作为消费者的订单
    for each_billing in Billing.query.filter_by(customer_id=curr_user.id).all():
        billing_info = {
            "id": each_billing.id,
            "provider_id": each_billing.provider_id,
            "customer_id": each_billing.customer_id,
            "provider_name": each_billing.provider_name,
            "customer_name": each_billing.customer_name,
            "address": each_billing.address,
            "start_date": each_billing.start_date,
            "end_date": each_billing.end_date,
            "unit_price": each_billing.unit_price,
            "total_price": each_billing.total_price,
            "payment_time": each_billing.payment_time,
            "customer_card_number": each_billing.customer_card_number,
            "provider_bank_account": each_billing.provider_bank_account
        }
        customer_billings.append(copy.deepcopy(billing_info))

    provider_billings = []
    # 自己作为提供者的订单
    for each_billing in Billing.query.filter_by(provider_id=curr_user.id).all():
        billing_info = {
            "id": each_billing.id,
            "provider_id": each_billing.provider_id,
            "customer_id": each_billing.customer_id,
            "provider_name": each_billing.provider_name,
            "customer_name": each_billing.customer_name,
            "address": each_billing.address,
            "start_date": each_billing.start_date,
            "end_date": each_billing.end_date,
            "unit_price": each_billing.unit_price,
            "total_price": each_billing.total_price,
            "payment_time": each_billing.payment_time,
            "customer_card_number": each_billing.customer_card_number,
            "provider_bank_account": each_billing.provider_bank_account
        }

        provider_billings.append(copy.deepcopy(billing_info))

    return {'customer_billings': customer_billings, 'provider_billings': provider_billings}, 200


@billing_bp.route('/profile/bank_account',methods=["GET", "POST"])
def myBankAccount():

    curr_user=g.curr_user
    curr_bank_account = Bank_account.query.filter_by(owner=curr_user).first()
    if request.method == 'GET':
        return_dict = {
            "account_id": curr_bank_account.account_id,
            "account_name": curr_bank_account.account_name,
            "bsb": curr_bank_account.bsb
        }
        return return_dict, 200

    elif request.method == 'POST':
        info_to_update = request.get_json()

        if info_to_update.get('account_id'):
            curr_bank_account.account_id = info_to_update.get('account_id')
        if info_to_update.get('account_name'):
            curr_bank_account.account_name = info_to_update.get('account_name')
        if info_to_update.get('bsb'):
            curr_bank_account.bsb = info_to_update.get('bsb')

        db.session.add(curr_bank_account)
        db.session.commit()
        return {}, 200


@billing_bp.route('/profile/credit_card',methods=["GET", "POST"])
def myCreditCard():
    curr_user=g.curr_user
    curr_credit_card = Credit_card.query.filter_by(owner=curr_user).first()
    if request.method == 'GET':
        return_dict = {
            "card_number": curr_credit_card.card_number,
            "card_name": curr_credit_card.card_name,
            "expiry_date": curr_credit_card.expiry_date,
            "cvv": curr_credit_card.cvv
        }
        return return_dict, 200
    elif request.method == 'POST':
        info_to_update = request.get_json()
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
        return {}, 200
