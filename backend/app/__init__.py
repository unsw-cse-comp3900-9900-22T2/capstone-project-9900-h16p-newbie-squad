import os
from flask import Flask
from config import config
from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

def create_app(name):
    app=Flask(__name__)
    app.config.from_object(config[name])
    config[name].init_app(app)

    db.init_app(app)

    @app.route("/")
    def index():
        return "hello,world!"

    from .commons import before_request_check_token
    @app.before_request
    def before_request():
        before_request_check_token()

    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    from .profile import profile_bp
    app.register_blueprint(profile_bp)

    from .car import car_bp
    app.register_blueprint(car_bp)

    from .parkingspace import parkingspace_bp
    app.register_blueprint(parkingspace_bp)

    from .listing import listing_bp
    app.register_blueprint(listing_bp)

    from .booking import booking_bp
    app.register_blueprint(booking_bp)

    return app

