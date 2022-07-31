from . import profile_bp
from flask import request,g
from .. import db
import base64



@profile_bp.route('/profile',methods=["GET", "POST"])
def profile():
    curr_user=g.curr_user

    curr_user_dict={
        'username':curr_user.username,
        'email':curr_user.email,
        'phone_num':curr_user.phone_num,
        #2021.7.31: 使用另外专门的API来查看bank_account和credit_card
        #'bank_account':curr_user.bank_account,
        #'credit_card':curr_user.credit_card,
        "avatar":base64.b64encode(curr_user.avatar).decode() if curr_user.avatar else None,
        'bio':curr_user.bio,
        'role':curr_user.role.role_name
    }

    if request.method == 'GET':
        return curr_user_dict, 200

    elif request.method == 'POST':
        info_to_update = request.get_json()

        if info_to_update.get('username'):
            #2022.7.11修改：用户名不能修改
            return {'error:':'cannot change username'},400

        if info_to_update.get('email'):
            curr_user.email = info_to_update['email']
        if info_to_update.get('phone_num'):
            curr_user.phone_num = info_to_update['phone_num']
        #if info_to_update.get('bank_account'):
        #    curr_user.bank_account = info_to_update['bank_account']
        #if info_to_update.get('credit_card'):
        #    curr_user.credit_card = info_to_update['credit_card']
        if info_to_update.get('avatar'):
            curr_user.avatar = base64.b64decode(info_to_update['avatar'])
        if info_to_update.get('bio'):
            curr_user.bio = info_to_update['bio']
        if info_to_update.get('password'):
            curr_user.password = info_to_update['password']

        try:
            db.session.add(curr_user)
            db.session.commit()
        except:
            return {'error':'db internal error'},400

        return {}, 200
