from . import auth_bp

from flask import Blueprint, request,render_template, redirect, session,url_for,jsonify

from .. import db
from ..models import Role, User


@auth_bp.route('/register',methods=['POST'])
def register():
    new_user_info=request.get_json()

    #must provide username, email, password
    if new_user_info.get('username')==None or new_user_info.get('email')==None \
    or new_user_info.get('password')==None:
        return {"error": "invalid input"},400

    #username and email must be unique
    if User.query.filter_by(username=new_user_info['username']).first()!=None:
        return {"error": "username has been registered"},400

    if User.query.filter_by(email=new_user_info['email']).first()!=None:
        return {"error": "email has been registered"},400

    customer=Role.query.filter_by(role_name='customer').first()

    new_user=User(username=new_user_info['username'],email=new_user_info['email'],\
        password=new_user_info['password'],role=customer)

    db.session.add(new_user)
    db.session.commit()

    new_user=User.query.filter_by(username=new_user_info['username']).first()

    token=new_user.generate_auth_token()

    #admin account is now built-in

    return {
        "token": token
    },200


@auth_bp.route('/login',methods=["POST"])
def login():
    user_info=request.get_json()

    if user_info.get('username')==None or user_info.get('password')==None:
        return {"error": "invalid input"},400

    #first check username exists, then password
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
    return {},200
