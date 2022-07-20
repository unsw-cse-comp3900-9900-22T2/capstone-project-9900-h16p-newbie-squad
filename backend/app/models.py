from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from itsdangerous.serializer import Serializer
from flask import current_app
from datetime import datetime


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(64), unique=True)
    #从Role到User一对多
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.role_name


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, index=True)
    email = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    phone_num = db.Column(db.String(32), unique=True, index=True)
    # bank_account = db.Column(db.String(32), unique=True, index=True)
    # credit_card = db.Column(db.String(32), unique=True, index=True)

    #前端将图片进行base64编码之后直接发送给后端，后端数据库存储该base64字节串
    avatar=db.Column(db.LargeBinary,nullable=True)

    bio=db.Column(db.String(128),nullable=True)
    #外键链接到Role表，一对多，多的那一侧
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    #从user到vehicle表（一对多，一的那一侧）
    vehicles = db.relationship('Vehicle', backref='owner', lazy='dynamic')
    #从user到parking_space表（一对多，一的那一侧）
    parking_spaces = db.relationship('Parking_space', backref='owner', lazy='dynamic')
    # 从user到bank_account表（一对一）
    bank_account = db.relationship('Bank_account', backref='owner', uselist=False)
    # 从user 到 credit_card表（一对一）
    credit_card = db.relationship('Credit_card', backref='owner', uselist=False)

    customer=db.relationship('Booking',backref='customer',lazy='dynamic')

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

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
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
    # owner = db.Column(db.String(32), db.ForeignKey('users.id'))
    #parking_space_type_id = db.Column(db.String(36), db.ForeignKey('Parking_space_types.id'))

    street = db.Column(db.String(32), nullable=False)
    suburb=db.Column(db.String(32), nullable=False)
    state=db.Column(db.String(32), nullable=False)
    postcode=db.Column(db.Integer, nullable=False)

    latitude=db.Column(db.String(32), nullable=True)
    longitude=db.Column(db.String(32), nullable=True)

    width = db.Column(db.Float, nullable=True)
    length = db.Column(db.Float, nullable=True)
    #parking_space_height = db.Column(db.Float, nullable=True)
    price = db.Column(db.Float, nullable=True)

    #一对多，一的那一侧
    #车位下架，listing自动也下架
    listings = db.relationship('Listing', backref='parking_space', lazy='dynamic'\
        ,cascade='all,delete-orphan')

    def __repr__(self):
        return '<Parking_space %r>' % self.id


class Listing(db.Model):
    __tablename__='listings'
    id = db.Column(db.Integer, primary_key=True)

    #一对多，多的那一侧
    parking_space_id=db.Column(db.Integer, db.ForeignKey('parking_spaces.id'))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    published_time=db.Column(db.DateTime,default=datetime.now)

    #一对多，一的那一侧
    bookings=db.relationship('Booking', backref='listing', lazy='dynamic')

    def __repr__(self):
        return '<listings %r>' % self.id


class Status:
    Pending=1
    Accepted_Payment_Required=2
    Rejected=3
    Successful=4
    Cancelled=5


#The default
#cascade behavior when an object is deleted is to set the foreign key in any related
#objects that link to it to a null value.
#Booking记录永远不会消失
class Booking(db.Model):
    __tablename__='bookings'
    id = db.Column(db.Integer, primary_key=True)
    #一对多，多的那一侧，如果listing已经下架了，那么listing字段为null
    listing_id=db.Column(db.Integer,db.ForeignKey('listings.id'))
    customer_id=db.Column(db.Integer,db.ForeignKey('users.id'))
    status=db.Column(db.Integer)
    booking_time=db.Column(db.DateTime,default=datetime.now)
    #snapshot?
    
    def __repr__(self):
        return '<bookings %r>' % self.id


#所有的订单记录都保存在这张表中
class Billing(db.Model):
    __tablename__='billings'
    id = db.Column(db.Integer, primary_key=True,index=True)

    #永久保存订单成功当时的provider和customer的id，便于后面搜索
    provider_id=db.Column(db.Integer,index=True)
    customer_id=db.Column(db.Integer,index=True)

    #永久保存订单成功当时的provider和customer的username
    provider_name=db.Column(db.String(32))
    customer_name=db.Column(db.String(32))

    #这张表只是存储历史记录，因此address不再分开了，生成历史记录的时候把street，suburb等合成一个字符串
    address=db.Column(db.String(64))
    start_date=db.Column(db.Date)
    end_date=db.Column(db.Date)
    unit_price=db.Column(db.Integer)
    total_price=db.Column(db.Integer)
    payment_time=db.Column(db.DateTime,default=datetime.now)

    #永久保存customer付款时用的银行卡号
    customer_card_number=db.Column(db.String(32))

    #永久保存provider收款时用银行账户
    provider_bank_account=db.Column(db.String(32))

    # #永久保存provider收款时用的银行卡号
    # provider_card_number=db.Column(db.String(32))

class Bank_account(db.Model):
    __tablename__ = 'bank_account'
    # accoount_id, owner_id, account_name, bsb
    account_id = db.Column(db.String(32), primary_key=True)
    # 一对多，多的那个
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    account_name = db.Column(db.String(32))
    bsb = db.Column(db.String(32))

    def __repr__(self):
        return '<Vehicle %r>' % self.account_id

class Credit_card(db.Model):
    __tablename__ = 'credit_card'
    # owner_id(db.ForeignKey('users.id')), card_number, card_name,Expiry_date, cvv
    card_number = db.Column(db.String(32), primary_key=True)
    # 一对多，多的那个
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    card_name = db.Column(db.String(32))
    expiry_date = db.Column(db.String(32))
    cvv = db.Column(db.String(32))

    def __repr__(self):
        return '<Vehicle %r>' % self.card_number



