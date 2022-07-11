from re import S
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from itsdangerous.serializer import Serializer
from flask import current_app

import base64

class Role(db.Model):
    __tablename__ = 'roles'
    # id = db.Column(db.Integer, server_default=str(uuid.uuid4()), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    # id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    #role_name is: admin, customer, provider
    role_name = db.Column(db.String(64), unique=True)
    #从Role到User一对多
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.role_name


class User(db.Model):
    __tablename__ = 'users'
    # id = db.Column(db.Integer, server_default=str(uuid.uuid4()),primary_key=True)
    # id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    #index attribute: If set to True, create an index for this column, so that queries are more efficient.
    username = db.Column(db.String(32), unique=True, index=True)
    email = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    phone_num = db.Column(db.String(32), unique=True, index=True)
    bank_account = db.Column(db.String(32), unique=True, index=True)

    #前端将图片进行base64编码之后直接发送给后端，后端数据库存储该base64字节串
    avatar=db.Column(db.LargeBinary,nullable=True)

    bio=db.Column(db.String(128),nullable=True)
    #外键链接到Role表，一对多，多的那一侧
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    #从user到vehicle表（一对多，一的那一侧）
    vehicles = db.relationship('Vehicle', backref='user', lazy='dynamic')
    #从user到parking_space表（一对多，一的那一侧）
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
        print('SECRET_KEY',current_app.config['SECRET_KEY'])
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps(self.id)

    @staticmethod
    def verify_auth_token(token):
        #print(token)
        #print(type(token))
        #token=str(token)
        #print('SECRET_KEY',current_app.config['SECRET_KEY'])
        s = Serializer(current_app.config['SECRET_KEY'])

        try:
            data = s.loads(token)
        except:
            return None
        return data

    def __repr__(self):
        return '<User %r>' % self.username

'''class Vehicle_type(db.Model):
    __tablename__ = 'vehicle_types'

    # id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    vehicle_typename = db.Column(db.String(36), unique=True)

    # 从vehicle_type到vehicle表（一对多）
    vehicles = db.relationship('Vehicle', backref='vehicle_type', lazy='dynamic')

    def __repr__(self):
        return '<Vehicle_type %r>' % self.vehicle_typename'''
#车辆类型暂时从需求中移除，没必要


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    # id, vehicle_owner_id, vehicle_type_id, vehicle_license_plate,vehicle_width,vehicle_length,vehicle_height,vehicle_weight
    # id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    #vehicle_type_id = db.Column(db.String(36), db.ForeignKey('vehicle_types.id'))
    plate_number = db.Column(db.String(32), unique=True,index=True)
    brand=db.Column(db.String(32))
    width = db.Column(db.Float, nullable=True)
    length = db.Column(db.Float, nullable=True)
    #height = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return '<Vehicle %r>' % self.plate_number


'''
class Parking_space_type(db.Model):
    __tablename__ = 'Parking_space_types'
    # id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    parking_space_typename = db.Column(db.String(36), unique=True)
    # 从Parking_space_type到Parking_space表（一对多）
    parking_spaces = db.relationship('Parking_space', backref='parking_space_type', lazy='dynamic')

    def __repr__(self):
        return '<Parking_space_type %r>' % self.parking_space_typename
'''



class Parking_space(db.Model):
    __tablename__ = 'parking_spaces'
    # id, parking_space_owner_id, parking_space_type_id,  parking_space_width, parking_space_length, parking_space_height, parking_space_address, parking_space_price, parking_space_is_available, parking_space_is_booked, parking_space_available_date
    # id = db.Column('id', db.String(36), default=lambda: str(uuid.uuid4()), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)

    #一对多，多的那一侧
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    #parking_space_type_id = db.Column(db.String(36), db.ForeignKey('Parking_space_types.id'))

    street = db.Column(db.String(32), nullable=False)
    suburb=db.Column(db.String(32), nullable=False)
    state=db.Column(db.String(32), nullable=False)
    postcode=db.Column(db.Integer, nullable=False)


    width = db.Column(db.Float, nullable=True)
    length = db.Column(db.Float, nullable=True)
    #parking_space_height = db.Column(db.Float, nullable=True)
    price = db.Column(db.Float, nullable=True)

    #TODO
    #parking_space_is_booked = db.Column(db.Boolean, nullable=True)

    #一对多，一的那一侧
    parking_time_ranges = db.relationship('Parking_time_range', backref='parking_space', lazy='dynamic')

    def __repr__(self):
        return '<Parking_space %r>' % self.id


class Parking_time_range(db.Model):
    __tablename__='parking_time_ranges'
    id = db.Column(db.Integer, primary_key=True)

    #一对多，多的那一侧
    parking_space_id=db.Column(db.Integer, db.ForeignKey('parking_spaces.id'))
    #start_date = db.Column(db.String(32))
    #end_date = db.Column(db.String(32))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    def __repr__(self):
        return '<Parking_time_ranges %r>' % self.id