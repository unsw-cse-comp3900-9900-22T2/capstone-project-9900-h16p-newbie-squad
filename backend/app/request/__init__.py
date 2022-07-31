from flask import Blueprint

request_bp = Blueprint('request', __name__)

from . import request_views


