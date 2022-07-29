from flask import Blueprint

review_bp = Blueprint('review', __name__)

from . import review_views
