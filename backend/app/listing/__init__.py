from flask import Blueprint

listing_bp = Blueprint('listing', __name__)

from . import listing_views