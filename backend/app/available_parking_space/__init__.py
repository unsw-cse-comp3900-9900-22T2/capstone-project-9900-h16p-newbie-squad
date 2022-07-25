from flask import Blueprint

available_parking_space_bp = Blueprint('available_parking_space', __name__)

from . import available_parking_space_views