from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from itsdangerous.serializer import Serializer
from flask import current_app

import base64

class Role(db.Model):
    __tablename__='roles'
    id = db.Column(db.Integer, primary_key=True)

    #role_name is: admin, customer, provider
    role_name = db.Column(db.String(64), unique=True)

    #从Role到User一对多
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.role_name


class User(db.Model):
    __tablename__='users'
    id = db.Column(db.Integer, primary_key=True)
    #index attribute: If set to True, create an index for this column, so that queries are more efficient.
    username = db.Column(db.String(64), unique=True, index=True)
    email = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))

    #外键链接到Role表
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    #前端将图片进行base64编码之后直接发送给后端，后端数据库存储该base64字节串
    avatar=db.Column(db.LargeBinary,nullable=True)

    bio=db.Column(db.String(128),nullable=True)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self):
        print(current_app.config['SECRET_KEY'])
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'id':self.id})


    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return User.query.get(data['id'])

    
    def __repr__(self):
        return '<User %r>' % self.username



