from . import profile_bp
from flask import request,g
from .. import db


@profile_bp.route('/profile',methods=["GET", "POST"])
def profile():
    curr_user=g.curr_user
    curr_user_role=g.curr_user_role

    curr_user_dict={
        'username':curr_user.username,
        'email':curr_user.email,
        'phone_num':curr_user.phone_num,
        'bank_account':curr_user.bank_account,
        'credit_card':curr_user.credit_card,
        'avatar':curr_user.avatar,
        'bio':curr_user.bio,
        'role':curr_user_role
    }

    if request.method == 'GET':
        return curr_user_dict, 200

    elif request.method == 'POST':
        #暂时不用判断是否是admin
        info_to_update = request.get_json()

        if info_to_update.get('username'):
            #2022.7.11修改：用户名不能修改
            return {'error:':'cannot change username'},400

        if info_to_update.get('email'):
            curr_user.email = info_to_update['email']
        if info_to_update.get('phone_num'):
            curr_user.phone_num = info_to_update['phone_num']
        if info_to_update.get('bank_account'):
            curr_user.bank_account = info_to_update['bank_account']
        if info_to_update.get('credit_card'):
            curr_user.credit_card = info_to_update['credit_card']
        if info_to_update.get('avatar'):
            curr_user.avatar = info_to_update['avatar']
        if info_to_update.get('bio'):
            curr_user.bio = info_to_update['bio']
        if info_to_update.get('password'):
            curr_user.password = info_to_update['password']

        db.session.add(curr_user)
        db.session.commit()
        return {}, 200
