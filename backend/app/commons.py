from flask import request,g
from .models import User,Role

def before_request_check_token():
    print('for current request, handler blueprint is:',request.blueprint)

    if request.blueprint=='profile' or request.blueprint=='car' \
        or request.blueprint=='parkingspace' or request.blueprint=='booking' \
        or request.blueprint=='billing' or request.blueprint=='admin':
    
        print('verifying token...')
        request_token=request.headers.get('token')
        try:
            user_id=User.verify_auth_token(request_token)
        except:
            return {'error':'invalid token'},400
        
        curr_user=User.query.filter_by(id=user_id).first()
        
        if(curr_user==None):
            return {'error':'no such user'},400
        
        g.curr_user=curr_user
        g.curr_user_role=Role.query.filter_by(id=curr_user.role_id).first().role_name

        if request.blueprint=='admin':
            if g.curr_user_role!='admin':
                return {'error':'no permission'},400

    else:
        g.curr_user=None
