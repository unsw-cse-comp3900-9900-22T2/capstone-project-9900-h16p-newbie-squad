from datetime import datetime
import os
from urllib import response
from flask import Flask, request, make_response
from config import config
from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

def create_app(name):
    app=Flask(__name__)
    app.config.from_object(config[name])
    config[name].init_app(app)

    db.init_app(app)

    from .commons import before_request_check_token
    @app.before_request
    def check_token():
        before_request_check_token()

    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    from .profile import profile_bp
    app.register_blueprint(profile_bp)

    from .car import car_bp
    app.register_blueprint(car_bp)

    from .parkingspace import parkingspace_bp
    app.register_blueprint(parkingspace_bp)

    from .available_parking_space import available_parking_space_bp
    app.register_blueprint(available_parking_space_bp)

    from .booking import booking_bp
    app.register_blueprint(booking_bp)

    from .billing import billing_bp
    app.register_blueprint(billing_bp)

    from .admin import admin_bp
    app.register_blueprint(admin_bp)

    from .review import review_bp
    app.register_blueprint(review_bp)

    from .request import request_bp
    app.register_blueprint(request_bp)

    from threading import Thread
    from time import sleep
    from .models import Booking,Status
    from app.booking.booking_views import cancelBooking
    def scan_unpaid_booking():
        with app.app_context():
            while True:
                for eachBooking in Booking.query.filter_by(status=Status.Accepted_Payment_Required).all():
                    interval=(datetime.now()-eachBooking.booking_time).total_seconds()
                    #must pay within one minute
                    if interval>=Status.Must_Pay_Within+5: cancelBooking(eachBooking.id)
                sleep(5)

    test=Thread(target=scan_unpaid_booking,daemon=True)
    test.start()

    return app

