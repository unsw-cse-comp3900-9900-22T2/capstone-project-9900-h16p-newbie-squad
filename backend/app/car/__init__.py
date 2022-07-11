from flask import Blueprint

car_bp = Blueprint('car', __name__)

from . import car_views