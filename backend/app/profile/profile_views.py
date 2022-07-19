from . import profile_bp

from flask import request,g

from .. import db


#这里面所有的view都需要是一个已经登录的（因此前端现在持有一个有效token）的用户
#因此在这个blueprint里面做一个before_request的函数来验证是不是有效用户
#如果是有效用户，则这个用户的信息暂存在g.curr_user里
'''@profile_bp.before_request
def before_profile_request():
    request_token=request.headers.get('token')
    try:
        user_id=User.verify_auth_token(request_token)
    except:
        return {'error':'invalid token'},400
    
    curr_user=User.query.filter_by(id=user_id).first()
    
    if(curr_user==None):
        return {'error':'no such user'},400
    
    g.curr_user=curr_user
    g.curr_user_role=Role.query.filter_by(id=curr_user.role_id).first().role_name'''


@profile_bp.route('/profile',methods=["GET", "POST"])
def profile():
    #代码重构，验证用户token放到了@profile_bp.before_request里面，减少代码复用
    #如果token有效，curr_user对象被放在了g.curr_user里面
    #将g.curr_user赋值给curr_user，避免代码大量修改
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
        #role暂时不可修改
        #username是否可以修改待定，目前先做成可以修改

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
