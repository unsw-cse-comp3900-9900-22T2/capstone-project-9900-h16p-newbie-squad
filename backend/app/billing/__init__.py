from flask import Blueprint

billing_bp = Blueprint('car', __name__)

from . import billing_views
