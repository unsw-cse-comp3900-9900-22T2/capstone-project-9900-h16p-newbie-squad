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

    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    return app

