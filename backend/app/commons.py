from flask import request,g
from .models import User
#from .review.review_views  import *

def before_request_check_token():
    print('For current request, handler blueprint is:',request.blueprint)
    print('Endpoint is: ',end='')
    print(request.endpoint)

    if request.blueprint=='profile' or request.blueprint=='car' \
        or request.blueprint=='parkingspace' or request.blueprint=='booking' \
        or request.blueprint=='billing' or request.blueprint=='admin' \
        or request.endpoint=='review.create_new_review'\
        or request.endpoint=='review.get_my_review_of_a_booking'\
        or request.endpoint=='review.get_my_reviews'\
        or request.endpoint=='delete_my_review':

        try:
            request_token=request.headers.get('token')
            print('Verifying token: ',request_token)
            user_id=User.verify_auth_token(request_token)
            print('user_id: ',user_id)
            if user_id is None: return False

            curr_user=User.query.filter_by(id=user_id).first()
            if request.blueprint=='admin' and curr_user.role.role_name!='admin': return False

            g.curr_user=curr_user
            print('current user logged in: ',curr_user.username)
            print('this user is: ',curr_user.role.role_name)
            return True
        except:
            return False
            
    else:
        g.curr_user=None
        return True
