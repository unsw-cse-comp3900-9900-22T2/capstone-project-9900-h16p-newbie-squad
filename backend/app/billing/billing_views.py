from . import billing_bp
from flask import request, g
from .. import db
from ..models import Billing
import copy


@billing_bp.route('/mybilling', methods=["GET"])
def myBilling():
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
            "provider_card_number": each_billing.provider_card_number
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
            "provider_card_number": each_billing.provider_card_number
        }

        provider_billings.append(copy.deepcopy(billing_info))

    return {'customer_billings': customer_billings, 'provider_billings': provider_billings}, 200
