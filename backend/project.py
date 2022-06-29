from app import create_app
from flask_cors import CORS, cross_origin

app=create_app('development')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


if __name__=='__main__':
    app.run()