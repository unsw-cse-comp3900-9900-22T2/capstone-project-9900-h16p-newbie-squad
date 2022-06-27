import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from itsdangerous.serializer import Serializer
from flask import current_app

import base64

class Role(db.Model):
    __tablename__ = 'roles'
    # id = db.Column(db.Integer, server_default=str(uuid.uuid4()),primary_key=True)
    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    #role_name is: admin, customer, provider
    role_name = db.Column(db.String(64), unique=True)
    #从Role到User一对多
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.role_name


class User(db.Model):
    __tablename__ = 'users'
    # id = db.Column(db.Integer, primary_key=True)
    # id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)

    #index attribute: If set to True, create an index for this column, so that queries are more efficient.
    username = db.Column(db.String(36), unique=True, index=True)
    email = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    phone_num = db.Column(db.String(36), unique=True, index=True)
    bank_account = db.Column(db.String(36), unique=True, index=True)

    #前端将图片进行base64编码之后直接发送给后端，后端数据库存储该base64字节串
    avatar=db.Column(db.LargeBinary,nullable=True)

    bio=db.Column(db.String(128),nullable=True)
    #外键链接到Role表
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    # 从 user到vehicle表（一对多）
    vehicles = db.relationship('Vehicle', backref='user', lazy='dynamic')
    # 从user到parking_space表（一对多）
    parking_spaces = db.relationship('Parking_space', backref='user', lazy='dynamic')

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


class Vehicle_type(db.Model):
    __tablename__ = 'vehicle_types'

    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_typename = db.Column(db.String(36), unique=True)

    # 从vehicle_type到vehicle表（一对多）
    vehicles = db.relationship('Vehicle', backref='vehicle_type', lazy='dynamic')

    def __repr__(self):
        return '<Vehicle_type %r>' % self.vehicle_typename

class Role(db.Model):
    __tablename__ = 'roles'
    # id = db.Column(db.Integer, server_default=str(uuid.uuid4()),primary_key=True)
    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    #role_name is: admin, customer, provider
    role_name = db.Column(db.String(64), unique=True)
    #从Role到User一对多
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.role_name


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    # id, vehicle_owner_id, vehicle_type_id, vehicle_license_plate,vehicle_width,vehicle_length,vehicle_height,vehicle_weight
    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_owner_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    vehicle_type_id = db.Column(db.String(36), db.ForeignKey('vehicle_types.id'))
    vehicle_license_plate = db.Column(db.String(36), unique=True, index=True)
    vehicle_width = db.Column(db.Float, nullable=True)
    vehicle_length = db.Column(db.Float, nullable=True)
    vehicle_height = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return '<Vehicle %r>' % self.vehicle_license_plate


class Parking_space_type(db.Model):
    __tablename__ = 'Parking_space_types'
    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    parking_space_typename = db.Column(db.String(36), unique=True)
    # 从Parking_space_type到Parking_space表（一对多）
    parking_spaces = db.relationship('Parking_space', backref='parking_space_type', lazy='dynamic')

    def __repr__(self):
        return '<Parking_space_type %r>' % self.parking_space_typename

class Parking_space(db.Model):
    __tablename__ = 'parking_spaces'
    # car_space_uuid, masterid, type(outdoor, indoor, undercover, driveway), 兼容车型, 限高, 长宽，地址，价格，是否上架，是否被预定，可用日期
    # id, parking_space_owner_id, parking_space_type_id,  parking_space_width, parking_space_length, parking_space_height, parking_space_address, parking_space_price, parking_space_is_available, parking_space_is_booked, parking_space_available_date
    id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    parking_space_owner_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    parking_space_type_id = db.Column(db.String(36), db.ForeignKey('Parking_space_types.id'))
    parking_space_address = db.Column(db.String(128), nullable=False)
    parking_space_width = db.Column(db.Float, nullable=True)
    parking_space_length = db.Column(db.Float, nullable=True)
    parking_space_height = db.Column(db.Float, nullable=True)
    parking_space_price = db.Column(db.Float, nullable=True)
    parking_space_is_available = db.Column(db.Boolean, nullable=True)
    parking_space_is_booked = db.Column(db.Boolean, nullable=True)
    parking_space_available_date = db.Column(db.String(36), nullable=True)

    def __repr__(self):
        return '<Parking_space %r>' % self.parking_space_address

