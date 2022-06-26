from . import auth_bp

from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request,render_template, redirect, session,url_for,jsonify

from .. import db
from ..models import Role, User


@auth_bp.route('/register',methods=['POST'])
def register():
    print('Postman request: ',end='')
    print(request)
    new_user_info=request.get_json()
    print(new_user_info)

    #注册时必须提供username, email, password，别的可以暂时不提供
    if new_user_info.get('username')==None or new_user_info.get('email')==None \
    or new_user_info.get('password')==None:
        return {"error": "invalid input"},400

    #username和email必须唯一
    if User.query.filter_by(username=new_user_info['username']).first()!=None:
        return {"error": "username has been registered"},400

    if User.query.filter_by(email=new_user_info['email']).first()!=None:
        return {"error": "email has been registered"},400

    #bio，头像等后面再提供
    new_user=User(username=new_user_info['username'],email=new_user_info['email'],\
        password=new_user_info['password'])

    db.session.add(new_user)
    db.session.commit()

    new_user=User.query.filter_by(username=new_user_info['username']).first()

    token=new_user.generate_auth_token()
    new_user_id=new_user.id
    print(token)
    print(new_user_id)

    return {
        "token": token
    },200


@auth_bp.route('/login',methods=["POST"])
def login():
    print('Postman request: ',end='')
    print(request)
    user_info=request.get_json()
    print(user_info)

    #登录时必须提供username和password
    #这个东西应该是前端去验证，后端不管，但是为了代码健壮性……
    if user_info.get('username')==None or user_info.get('password')==None:
        return {"error": "invalid input"},400

    #如果这个用户名没有被注册
    curr_user=User.query.filter_by(username=user_info['username']).first()
    if curr_user==None:
        return {"error": "invalid username"},400

    if curr_user.verify_password(user_info['password'])!=True:
        return {"error": "invalid password"},404

    token=curr_user.generate_auth_token()
    return {
        "token": token
    },200


@auth_bp.route('/logout',methods=["POST"])
def logout():
    #这里仅仅只是占位
    #删除token的操作应该由前端完成
    return {},200
