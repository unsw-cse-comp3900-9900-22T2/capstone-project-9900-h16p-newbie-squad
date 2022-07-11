from flask import Blueprint

parkingspace_bp = Blueprint('parkingspace', __name__)

from . import parkingspace_views