from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from itsdangerous.serializer import Serializer
from flask import current_app
from datetime import datetime


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(64), unique=True)
    #From Role to User: one to many relation
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

    avatar=db.Column(db.LargeBinary,nullable=True)

    bio=db.Column(db.String(128),nullable=True)

    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    #From users to vehicles: the one to many relation's "one" side
    vehicles = db.relationship('Vehicle', backref='owner', lazy='dynamic')
    #From users to parking spaces: the one to many relation's "one" side
    parking_spaces = db.relationship('Parking_space', backref='owner', lazy='dynamic')

    requests = db.relationship('Request', backref='owner', lazy='dynamic')

    offers = db.relationship('Offer', backref='owner', lazy='dynamic')

    reviews = db.relationship('Review', backref='author', lazy='dynamic')

    bank_account = db.relationship('Bank_account', backref='owner', uselist=False)
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


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    plate_number = db.Column(db.String(32), unique=True,index=True)
    brand=db.Column(db.String(32))
    width = db.Column(db.Float, nullable=True)
    length = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return '<Vehicle %r>' % self.plate_number


class Parking_space(db.Model):
    __tablename__ = 'parking_spaces'
    id = db.Column(db.Integer, primary_key=True)

    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))

    street = db.Column(db.String(32), nullable=False)
    suburb=db.Column(db.String(32), nullable=False)
    state=db.Column(db.String(32), nullable=False)
    postcode=db.Column(db.Integer, nullable=False)

    latitude=db.Column(db.String(32), nullable=True)
    longitude=db.Column(db.String(32), nullable=True)

    width = db.Column(db.Float, nullable=True)
    length = db.Column(db.Float, nullable=True)
    price = db.Column(db.Float, nullable=True)

    #if is_active is False，the parking_space is deleted
    is_active=db.Column(db.Boolean,nullable=False)

    bookings=db.relationship('Booking', backref='parking_space', lazy='dynamic')
    available_periods=db.relationship('Available_Period', backref='parking_space', lazy='dynamic',\
        cascade='all,delete-orphan')
    
    reviews=db.relationship('Review', backref='parking_space', lazy='dynamic')
    average_rating=db.Column(db.Float, nullable=True)

    picture_1=db.Column(db.LargeBinary,nullable=True)
    picture_2=db.Column(db.LargeBinary,nullable=True)
    picture_3=db.Column(db.LargeBinary,nullable=True)

    def __repr__(self):
        return '<Parking_space %r>' % self.id


class Available_Period(db.Model):
    __tablename__='available_periods'
    id = db.Column(db.Integer, primary_key=True)
    parking_space_id=db.Column(db.Integer, db.ForeignKey('parking_spaces.id'))
    start_date=db.Column(db.Date)
    end_date=db.Column(db.Date)

    def __repr__(self):
        return '<available_periods %r>' % self.id


class Status:
    Accepted_Payment_Required=1
    Successful=2
    Cancelled=3
    Must_Pay_Within=60


#The default
#cascade behavior when an object is deleted is to set the foreign key in any related
#objects that link to it to a null value.
class Booking(db.Model):
    __tablename__='bookings'
    id = db.Column(db.Integer, primary_key=True)
    parking_space_id=db.Column(db.Integer,db.ForeignKey('parking_spaces.id'))
    customer_id=db.Column(db.Integer,db.ForeignKey('users.id'))
    status=db.Column(db.Integer)
    start_date=db.Column(db.Date)
    end_date=db.Column(db.Date)
    booking_time=db.Column(db.DateTime,default=datetime.now)
    
    review=db.relationship('Review', backref='booking', lazy='dynamic')

    def __repr__(self):
        return '<bookings %r>' % self.id


class Review(db.Model):
    __tablename__='reviews'
    id = db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'))
    parking_space_id=db.Column(db.Integer,db.ForeignKey('parking_spaces.id'))
    booking_id=db.Column(db.Integer,db.ForeignKey('bookings.id'))
    review_text=db.Column(db.String(256), nullable=False)
    review_rating=db.Column(db.Integer, nullable=False)
    review_made_time=db.Column(db.DateTime,default=datetime.now)

    def __repr__(self):
        return '<reviews %r>' % self.id


#all the billing histories are stored in this table
class Billing(db.Model):
    __tablename__='billings'
    id = db.Column(db.Integer, primary_key=True,index=True)

    provider_id=db.Column(db.Integer,index=True)
    customer_id=db.Column(db.Integer,index=True)

    provider_name=db.Column(db.String(32))
    customer_name=db.Column(db.String(32))

    address=db.Column(db.String(64))
    start_date=db.Column(db.Date)
    end_date=db.Column(db.Date)
    unit_price=db.Column(db.Integer)
    total_price=db.Column(db.Integer)
    rent_fee = db.Column(db.Integer)
    service_fee = db.Column(db.Integer)
    payment_time=db.Column(db.DateTime,default=datetime.now)

    customer_card_number=db.Column(db.String(32))

    provider_bank_account=db.Column(db.String(32))


class Bank_account(db.Model):
    __tablename__ = 'bank_account'
    account_id = db.Column(db.String(32), primary_key=True)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    account_name = db.Column(db.String(32))
    bsb = db.Column(db.String(32))

    def __repr__(self):
        return '<Vehicle %r>' % self.account_id

class Credit_card(db.Model):
    __tablename__ = 'credit_card'
    card_number = db.Column(db.String(32), primary_key=True)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    card_name = db.Column(db.String(32))
    expiry_date = db.Column(db.String(32))
    cvv = db.Column(db.String(32))

    def __repr__(self):
        return '<Vehicle %r>' % self.card_number


class Request(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    title = db.Column(db.String(32), nullable=False)
    street = db.Column(db.String(32), nullable=False)
    suburb = db.Column(db.String(32), nullable=False)
    state = db.Column(db.String(32), nullable=False)
    postcode = db.Column(db.Integer, nullable=False)
    latitude = db.Column(db.String(32), nullable=True)
    longitude = db.Column(db.String(32), nullable=True)
    budget = db.Column(db.Float, nullable=True)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    others = db.Column(db.Text)
    complete = db.Column(db.Boolean, nullable=False)
    is_active = db.Column(db.Boolean,nullable=False)
    publish = db.Column(db.Boolean, nullable=False)

    offers = db.relationship('Offer', backref='request', lazy='dynamic')

    def __repr__(self):
        return '<Request %r>' % self.id


class Offer(db.Model):
    __tablename__ = 'offers'
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('requests.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    street = db.Column(db.String(32), nullable=False)
    suburb = db.Column(db.String(32), nullable=False)
    state = db.Column(db.String(32), nullable=False)
    postcode = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=True)
    comments = db.Column(db.Text)
    is_active = db.Column(db.Boolean, nullable=False)
    accept = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Offer %r>' % self.id



