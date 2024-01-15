from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from flask import Flask, render_template
from flask_restful import Api
from os import path
from flask_cors import CORS
from datetime import datetime, timedelta
from applications.models import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_caching import Cache
from applications import workers
from applications.tasks import *


tsapp = None
api = None
celery = None
 


#Creating application
def initiate_app():
    #Creating a Flask instance
    tsapp = Flask(__name__, template_folder="templates") 
    tsapp.config['SECRET_KEY'] = "21f1003052"
    
    #Adding datatbase
    tsapp.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydb.sqlite3'
    tsapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    

    # Initalising database
    db.init_app(tsapp)
    tsapp.app_context().push()

    tsapp.config["JWT_SECRET_KEY"] = "heyiamyoursecretkeymaker"
    tsapp.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)


    jwt = JWTManager(tsapp)
    tsapp.app_context().push()

    CORS(tsapp)

    celery = workers.celery

    celery.conf.update(
        broker_url='redis://localhost:6379',
        result_backend='redis://localhost:6379'
    )
    celery.Task = workers.ContextTask
    tsapp.app_context().push()


    #Initalizing API
    api = Api(tsapp)
    tsapp.app_context().push()

    #Calling fun to create database
    initiate_DB(tsapp)
    return tsapp , api, jwt ,celery

# Creating database
def initiate_DB(app):
    if path.exists('/mydb.sqlite3') == False:
        db.create_all()
    return True


# Calling fun to create application
tsapp, api , jwt, celery= initiate_app()



from applications.api import UserAPI, AdminAPI, ShowsAPI, VenuesAPI, AdminProfileAPI, VenueDetailAPI, ShowDetailAPI, ExportAPI
from applications.api import UserProfileAPI, LogoutAPI, BookingAPI, SearchAPI, SummaryAPI, RatingAPI, UserDashboardAPI


# Add the API resources to the app
api.add_resource(AdminAPI, '/api/admin/register', '/api/admin/login') #post, get
api.add_resource(AdminProfileAPI, '/api/admin/profile') #get
api.add_resource(UserAPI, '/api/user/login', '/api/user/register') #get, post
api.add_resource(UserProfileAPI, '/api/user/profile') #get
api.add_resource(LogoutAPI, '/api/admin/logout', '/api/user/logout') #post #post
api.add_resource(VenuesAPI, '/api/admin', '/api/admin/create_venue','/api/admin/<int:venue_id>/modify', '/api/admin/<int:venue_id>/delete') #get, post, put, delete
api.add_resource(ShowsAPI, '/api/admin/<int:venue_id>','/api/admin/<int:venue_id>/create' ,'/api/admin/<int:venue_id>/<int:show_id>/modify', '/api/admin/<int:venue_id>/<int:show_id>/delete') #get, post, put, delete
api.add_resource(BookingAPI, '/api/user/bookings', '/api/user/<int:show_id>/book') #get, post
api.add_resource(VenueDetailAPI, '/api/user/venue/<int:venue_id>') #get
api.add_resource(ShowDetailAPI, '/api/user/show/<int:show_id>') #get
api.add_resource(SearchAPI, '/api/user/search') #get
api.add_resource(SummaryAPI, '/api/admin/summary') #get
api.add_resource(RatingAPI, '/api/user/<int:show_id>/rate')  #post
api.add_resource(UserDashboardAPI, "/api/user") #get
api.add_resource(ExportAPI, '/api/admin/export')





@tsapp.route("/")
def home():
    return render_template("index.html")


@tsapp.route("/admin")
def admin():
    return render_template("admin.html")

@tsapp.route("/user")

def user():
    return render_template("user.html")

# Running the application
if __name__ == '__main__':
    tsapp.run(debug=True)