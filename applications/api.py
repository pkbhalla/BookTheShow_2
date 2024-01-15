import os, time
from flask import request, session, jsonify, send_file
from flask import current_app as app
from flask_restful import Resource, Api, abort, reqparse
from flask_sqlalchemy import SQLAlchemy
from applications.models import User, Venues, Shows, Bookings, Ratings, db
from sqlalchemy import or_
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import seaborn as sns
from flask_caching import Cache
import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt


upload_extensions = ['.jpg', '.png', '.jpeg']

app.config["CACHE_TYPE"] = "redis"
app.config['CACHE_REDIS_HOST'] = "localhost"
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_REDIS_DB'] = 0
app.config["CACHE_REDIS_URL"] = "redis://localhost:6379"  
app.config['CACHE_DEFAULT_TIMEOUT'] = 500

cac = Cache(app)

#--------------------------------------ADMIN API----------------------------------------------


# Admin API
class AdminAPI(Resource):
    #admin registration
    def post(self):
        name = request.form.get("name")
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        place = request.form.get("place")
        img = request.files.get("img")
        file_name=secure_filename(img.filename)
        # Checking if username or email already exists in the database
        existing_user = User.query.filter_by(username=username).first()
        existing_email = User.query.filter_by(email=email).first()
        if existing_user or existing_email:
            return {'message': 'Username or email already exists. Please choose another.'}, 400
        
        # Create a new user and save to the database
        if file_name!="":
            file_ext=os.path.splitext(file_name)[1]
            renamed_file_name=username+file_ext
            if file_ext not in upload_extensions:
                abort(400, message="Wrong input file type.")
            img.save(os.path.join("static","images", renamed_file_name))
        ad_user = User(name = name, username=username, email=email,img=renamed_file_name, place=place, last_visit=datetime.utcnow(), is_admin=1)
        ad_user.password = generate_password_hash(password)
        access_token = create_access_token(identity=email)
        db.session.add(ad_user)
        db.session.commit()
        return {'message': 'Admin registered successfully', 'token':access_token}, 201


    # admin login
    def get(self):
        username = request.args.get('username')
        password = request.args.get('password')
        # Check if the user exists in the database
        ad_user = User.query.filter_by(username=username).first()
        if not ad_user or not check_password_hash(ad_user.password, password):
            return {'message': 'Invalid credentials'}, 401
        access_token = create_access_token(identity=ad_user.email)
        # Log the user in and return success message
        db.session.commit()
        return {"message":"Login successful", "token": access_token}, 200

# Admin Profile API
class AdminProfileAPI(Resource):
    # Get admin profile details
    @jwt_required()
    @cac.cached(timeout=5)
    def get(self):
        ad_user = get_jwt_identity()
        ad_data = User.query.filter_by(email=ad_user).first()
        if ad_data:
            if ad_data.is_admin==1:
                return {
                    'name': ad_data.name,
                    'username': ad_data.username,
                    'email': ad_data.email,
                    'place': ad_data.place,
                    'img': ad_data.img
                }, 200
            return {"message": "Forbidden"}, 403
        return {'message':'Admin Login Required'}, 401



#--------------------------------------USER API----------------------------------------------



# User API
class UserAPI(Resource):
    # User registration
    def post(self):
        name = request.form.get("name")
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        place = request.form.get("place")
        img = request.files.get("img")
        file_name=secure_filename(img.filename)
        # Checking if username or email already exists in the database
        existing_user = User.query.filter_by(username=username).first()
        existing_email = User.query.filter_by(email=email).first()
        if existing_user or existing_email:
            return {'message': 'Username or email already exists. Please choose another.'}, 400
        
        # Create a new user and save to the database
        if file_name!="":
            file_ext=os.path.splitext(file_name)[1]
            renamed_file_name=username+file_ext
            if file_ext not in upload_extensions:
                abort(400, message="Wrong input file type.")
            img.save(os.path.join("static","images", renamed_file_name))
        user = User(name = name, username=username, email=email,img=renamed_file_name, place=place, last_visit=datetime.utcnow())
        user.password = generate_password_hash(password)
        access_token = create_access_token(identity=email)
        db.session.add(user)
        db.session.commit()
        return {'message': 'User registered successfully', 'token':access_token}, 201

    # user login
    @cac.cached(timeout=5)
    def get(self):
        username = request.args.get('username')
        password = request.args.get('password')
        # Check if the user exists in the database
        user = User.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.password, password):
            return {'message': 'Invalid credentials'}, 401
        if user.is_admin ==1:
            return {'message': "Admin login required"}, 401
        access_token = create_access_token(identity=user.email)
        # Log the user in and return success message
        user.last_visit=datetime.utcnow()
        db.session.commit()
        return {"message":"Login successful", "token": access_token}, 200




# User Profile API
class UserProfileAPI(Resource):
    # Get user profile details
    @jwt_required()
    @cac.cached(timeout=5)
    def get(self):
        user = get_jwt_identity()
        data = User.query.filter_by(email=user).first()
        if data:
            if data.is_admin==0:
                return {
                    'name': data.name,
                    'username': data.username,
                    'email': data.email,
                    'place': data.place,
                    'img': data.img
                }, 200
            return {"message": "Forbidden"}, 403
        return {'message':'User Login Required'}, 401








#-------------------------LOGOUT API-------------------------------------

# Common Logout API
class LogoutAPI(Resource):
    # User or Admin logout
    @jwt_required()
    def post(self):
        return {'message': 'Logout successful'}, 200






#---------------------------VENUE API----------------------

class VenuesAPI(Resource):
    @jwt_required()
    def get(self):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:
                venue_data = Venues.query.filter(Venues.admin_id ==ad_data.id).all()
                if len(venue_data)>=1:
                    return [{'venue_id': venue.venue_id, 'venue_name': venue.venue_name,
                        'venue_place': venue.venue_place, 'venue_location': venue.venue_location,
                        'venue_img': venue.venue_img, 'venue_capacity': venue.venue_capacity} for venue in venue_data]
                else:
                    return {'message': 'No venues found'}, 200
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised, login required.')


    @jwt_required()                
    def post(self): 
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:
                venue_name = request.form.get("venue_name")
                venue_capacity = request.form.get("venue_capacity")
                venue_location = request.form.get("venue_location")
                venue_place = request.form.get("venue_place")
                venue_img = request.files.get("venue_img")
                file_name = secure_filename(venue_img.filename)
                if file_name!="":
                    file_ext=os.path.splitext(file_name)[1]
                    renamed_file_name=str(ad_data.id)+"_"+venue_location+venue_place+file_ext
                if file_ext not in upload_extensions:
                    abort(400, message="Wrong input file type.")
                venue_img.save(os.path.join("static","images", renamed_file_name))
                venue = Venues(venue_name=venue_name, venue_place=venue_place,
                        venue_location=venue_location, venue_img=renamed_file_name,
                        venue_capacity=venue_capacity, admin_id=ad_data.id)
                db.session.add(venue)
                db.session.commit()
                return {'message': 'Venue created successfully'}, 201
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')


    @jwt_required()   
    def put(self, venue_id):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:
                venue = Venues.query.get(venue_id)
                if not venue:
                    abort(404, message='Venue not found')
                venue.venue_name = request.form.get('venue_name')
                venue.venue_capacity = request.form.get('venue_capacity')
                venue_img = request.files.get('venue_img')
                file_name = secure_filename(venue_img.filename)
                if file_name!="":
                    file_ext=os.path.splitext(file_name)[1]
                    renamed_file_name=str(ad_data.id)+"_"+venue.venue_location+venue.venue_place+file_ext
                if file_ext not in upload_extensions:
                    abort(400, message="Wrong input file type.")
                venue_img.save(os.path.join("static","images", renamed_file_name))
                venue.venue_img = renamed_file_name
                db.session.commit()
                return {'message': 'Venue updated successfully'}, 200
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')


    @jwt_required()
    def delete(self, venue_id):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:        
                venue = Venues.query.get(venue_id)
                if not venue:
                    abort(404, message='Venue not found')
                file_name = os.path.join("./static/images", venue.venue_img)
                if file_name:
                    os.remove(file_name)
                db.session.delete(venue)
                db.session.commit()
                return {'message': 'Venue deleted successfully'}
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')







#----------------------SHOW API--------------------------------------------------
class ShowsAPI(Resource):
    @jwt_required()
    def get(self, venue_id):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:        
                shows = Shows.query.filter(Shows.venue_id==venue_id).all()
                if not shows:
                    return {"message":'Show not found'}, 200
                return [{
                    'show_id': show.show_id,
                    'show_name': show.show_name,
                    'show_rating': show.show_rating,
                    'show_genre': show.show_genre,
                    'show_date': show.show_date,
                    'show_time': show.show_time,
                    'show_price': show.show_price,
                    'show_img': show.show_img,
                    'show_revenue': show.show_revenue} for show in shows]
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')
            
            


    @jwt_required()
    def post(self, venue_id):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:
                show_name = request.form.get("show_name")
                show_rating = request.form.get("show_rating")
                show_genre = request.form.get("show_genre")
                show_date = request.form.get("show_date")
                show_time = request.form.get("show_time")
                show_price = request.form.get("show_price")
                show_img = request.files.get("show_img")
                file_name = secure_filename(show_img.filename)
                if file_name!="":
                    file_ext=os.path.splitext(file_name)[1]
                    renamed_file_name=str(venue_id)+"_"+show_name+file_ext
                if file_ext not in upload_extensions:
                    abort(400, message="Wrong input file type.")
                show_img.save(os.path.join("static","images", renamed_file_name))
                show = Shows(
                    show_name=show_name,
                    show_rating=show_rating,
                    show_genre=show_genre,
                    show_date=show_date,
                    show_time=show_time,
                    show_price=show_price,
                    show_img=renamed_file_name,
                    venue_id = venue_id,
                    show_admin_id = ad_data.id,
                    show_capacity = Venues.query.filter_by(venue_id=venue_id).first().venue_capacity
                )
                db.session.add(show)
                db.session.commit()
                return {'message': 'Show created successfully'}
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')
            


    @jwt_required()
    def put(self, venue_id, show_id):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:        
                show = Shows.query.filter_by(show_id=show_id).first()
                if not show:
                    abort(404, message='Show not found')
                show_genre = request.form.get("show_genre")
                show_date = request.form.get("show_date")
                show_time = request.form.get("show_time")
                show_price = request.form.get("show_price")
                show_img = request.files.get("show_img")
                file_name = secure_filename(show_img.filename)
                if file_name!="":
                    file_ext=os.path.splitext(file_name)[1]
                    renamed_file_name=str(venue_id)+"_"+show.show_name+file_ext
                if file_ext not in upload_extensions:
                    abort(400, message="Wrong input file type.")
                show_img.save(os.path.join("static","images", renamed_file_name))
                show.show_genre=show_genre
                show.show_date=show_date
                show.show_time=show_time
                show.show_price=show_price
                show.show_img=renamed_file_name  
                db.session.commit()
                return {'message': 'Show updated successfully'}
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')

    @jwt_required()
    def delete(self, venue_id ,show_id):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:                
                show = Shows.query.get(show_id)
                if not show:
                    abort(404, message='Show not found')
                file_name = os.path.join("./static/images", show.show_img)
                if file_name:
                    os.remove(file_name)                
                db.session.delete(show)
                db.session.commit()
                return {'message': 'Show deleted successfully'}
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')


#--------------------------------------------USER DASHBOARD API---------------------------------
class UserDashboardAPI(Resource):
    @jwt_required()
    @cac.cached(timeout=5)
    def get(self):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:  
                venues = Venues.query.filter_by(venue_place=user_data.place).all()
                venue_data = []
                for venue in venues:
                    shows = Shows.query.filter_by(venue_id=venue.venue_id).all()
                    venue_info = {
                        'venue_name': venue.venue_name,
                        'venue_img': venue.venue_img, 'venue_place': venue.venue_place,
                        'venue_location': venue.venue_location,
                        'shows': [{'show_id': show.show_id,'show_name': show.show_name, 'show_time': show.show_time,
                                   'show_date':show.show_date, 'show_rating':show.show_rating,
                                   'show_img':show.show_img} for show in shows]
                    }
                    venue_data.append(venue_info)
                return {'venues': venue_data}, 200
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')

#-----------------------------------------BOOKING API--------------------------------------------------

booking_parser = reqparse.RequestParser()
booking_parser.add_argument('no_of_seats', type=int, required=True)

class BookingAPI(Resource):
    @jwt_required()
    def get(self):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:
                bookings = Bookings.query.filter_by(user_id=user_data.id).order_by(Bookings.booking_datetime.desc()).all()
                if not bookings:
                    abort(404, message='Bookings not found')
                return [{
                    "bid": booking.bid,
                    "user_id": booking.user_id,
                    "show_id":booking.show_id
                } for booking in bookings]                 
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')




    @jwt_required()
    def post(self, show_id):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:
                args = booking_parser.parse_args()
                total_bookings = Bookings.query.filter_by(show_id=show_id).all()
                show_det= Shows.query.filter_by(show_id=show_id).first()
                if len(total_bookings)+int(args["no_of_seats"])>int(show_det.show_capacity):
                    return {'message':"Show is houseful!"}
                elif len(total_bookings)+int(args["no_of_seats"])<=int(show_det.show_capacity):
                    show_det.show_capacity = int(show_det.show_capacity)-int(args["no_of_seats"])
                    show_det.show_revenue = int(show_det.show_revenue)+(int(show_det.show_price)*int(args["no_of_seats"]))
                    booking = Bookings(user_id = user_data.id, show_id=show_id)
                    db.session.add(booking)
                    db.session.commit()
                    return {"message": "Booking Successful"}, 200
            abort(302, message="Forbidden")
        abort(401, message='Unauthorised')        



#-------------------------------------------------DETAILS API----------------------------------------------

class ShowDetailAPI(Resource):
    @jwt_required()
    def get(self, show_id):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:
                show_det = Shows.query.filter_by(show_id=show_id).first()
                return {
                    'show_name': show_det.show_name,
                    'show_genre': show_det.show_genre,
                    'show_date': show_det.show_date,
                    'show_time': show_det.show_time,
                    'show_rating': show_det.show_rating,
                    'show_price': show_det.show_price,
                    'show_img': show_det.show_img
                }
            abort(301, message="Forbidden")
        abort(400, message="Unauthorised")




class VenueDetailAPI(Resource):
    @jwt_required()
    def get(self, venue_id):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:  
                venue = Venues.query.filter_by(venue_id=venue_id).first()
                shows = Shows.query.filter_by(venue_id=venue.venue_id).all()
                venue_info = {
                        'venue_name': venue.venue_name,
                        'venue_img': venue.venue_img, 'venue_place': venue.venue_place,
                        'venue_location': venue.venue_location,
                        'shows': [{'show_id': show.show_id,'show_name': show.show_name, 'show_time': show.show_time,
                                   'show_date':show.show_date, 'show_rating':show.show_rating,
                                   'show_img':show.show_img} for show in shows]}
                return venue_info, 200
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')










#-------------------------------------------RATING API-------------------------------------------------------
rating_parser = reqparse.RequestParser()
rating_parser.add_argument('rating_value', type=int, required=True)

class RatingAPI(Resource):
    @jwt_required()
    def post(self, show_id):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:
                args = rating_parser.parse_args()        
                rating_value = args.get("rating_value")
                if rating_value < 1 or rating_value > 5:
                    return {"message": "Invalid rating value"}, 400            
                show = Shows.query.filter_by(show_id=show_id)
                if show is None:
                    return {"message": "Show not found"}, 404
                # Save the rating to the database
                rating = Ratings(rshow_id=show_id, ruser_id = user_data.id ,ratings=rating_value)
                db.session.add(rating)
                db.session.commit()
                ratings_per_show=Ratings.query.filter_by(rshow_id=show_id).all()
                rating_list=[int(rating.ratings) for rating in ratings_per_show]
                avg_rating=sum(rating_list)/len(rating_list)
                show_det=Shows.query.filter_by(show_id=show_id).first()
                show_det.show_rating=avg_rating
                db.session.commit()                
                return {"message": "Rating submitted successfully"}, 200
            abort(302, message="Forbidden")
        abort(401, message='Unauthorised')        





#------------------------------------SEARCH API-------------------------------------

class SearchAPI(Resource):
    @jwt_required()
    def get(self):
        user_email = get_jwt_identity()
        if user_email:
            user_data = User.query.filter_by(email=user_email).first()
            if user_data.is_admin==0:
                query = request.args.get('query')  # Get the search query from the request
                if not query:
                    return jsonify({'message': 'Query parameter missing'}), 400
                # Search for shows based on title, tag, rating
                shows = Shows.query.filter(or_(Shows.show_name.ilike(f'%{query}%'), Shows.show_genre.ilike(f'%{query}%'), Shows.show_rating.ilike(f'%{query}%'))).all()
                # Search for venues based on venue name or location
                venues = Venues.query.filter(or_(Venues.venue_name.ilike(f'%{query}%'), Venues.venue_place.ilike(f'%{query}%'), Venues.venue_location.ilike(f'%{query}%'))).all()
                results = {
                    'shows': [{'show_id': show.show_id, 'show_name': show.show_name, 'show_time': show.show_time
                               ,'show_genre': show.show_genre, 'show_date': show.show_date, 'show_price': show.show_price} for show in shows],
                    'venues': [{'venue_id': venue.venue_id,'venue_name': venue.venue_name, 'venue_location': venue.venue_location,
                                 'venue_place': venue.venue_place} for venue in venues]
                }
                return results, 200
            abort(302, message="Forbidden")
        abort(401, message='Unauthorised')        


#------------------------------------------SUMMARY API for ADMIN-----------------------------------------------
class SummaryAPI(Resource):
    @jwt_required()
    def get(self):
        ad_email = get_jwt_identity()
        if ad_email:
            ad_data = User.query.filter_by(email=ad_email).first()
            if ad_data.is_admin==1:   
                booking_det=Bookings.query.all()
                show_det=Shows.query.filter_by(show_admin_id=ad_data.id).all()
                sid_list=[s.show_id for s in show_det]
                bsid_list=[bs.show_id for bs in booking_det]
                b_sid_aid=[]
                for sid in sid_list:
                    if sid in bsid_list:
                        b_sid_aid.append(sid)
                genre_revenue={}
                for sid in b_sid_aid:
                    show_d=Shows.query.filter_by(show_id=sid).first()
                    if show_d.show_genre not in genre_revenue:
                        genre_revenue[show_d.show_genre]=show_d.show_revenue
                    else:
                        genre_revenue[show_d.show_genre]+=show_d.show_revenue
                if len(b_sid_aid)!=0:
                    with app.app_context():
                        sns.barplot(x=list(genre_revenue.keys()), y=list(genre_revenue.values()))
                        plt.xlabel("Genre")
                        plt.ylabel("Revenue")
                        plt.title("Revenue by Genre")
                        plt.savefig(os.path.join("./static/images", "revenue.jpg"))
                    return {'graph':'revenue.jpg'}, 200
                else:
                    return {"message": "No bookings found"}, 200
            abort(403, message='Forbidden')
        abort(401, message='Unauthorised')

@app.route('/testc')
@cac.cached(timeout=50)
def testingcache():
    time.sleep(10)
    return "Cached"

from applications.tasks import export_venue_to_csv_email

class ExportAPI(Resource):
    @jwt_required()
    def get(self):
        current_user_email = get_jwt_identity()
        current_user_role = User.query.filter_by(email=current_user_email).first().is_admin
        if current_user_role == 1:
            venue_id = request.args.get('venue_id')
            if venue_id and Venues.query.get(venue_id):
                export_venue_to_csv_email.apply_async(args=[venue_id, current_user_email])
                return {'message': f'CSV for {venue_id} with details emailed to you.'}, 200
            else:
                return {'message': f'Invalid or missing venue id'}, 400
        else:
            return {'message': f'You are not authorized to access this resource'}, 401


