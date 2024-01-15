from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    last_visit = db.Column(db.DateTime, default=datetime.utcnow())
    place = db.Column(db.String(100), nullable=False)
    img = db.Column(db.String(200), nullable=False) 
    is_admin = db.Column(db.Integer, default=0) #0 for no, 1 for yes
    created_shows = db.relationship("Shows", back_populates="show_admin")


class Bookings(db.Model):
    __tablename__ = 'bookings'
    bid = db.Column(db.Integer, primary_key=True)
    booking_datetime = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('shows.show_id'), nullable=False)
    show = db.relationship("Shows", back_populates="bookings")



class Venues(db.Model):
    __tablename__ = 'venues'
    venue_id = db.Column(db.Integer, primary_key=True)
    venue_name = db.Column(db.String(255), nullable=False)
    venue_place = db.Column(db.String(255), nullable=False)
    venue_location = db.Column(db.String(200), nullable=False)
    venue_img = db.Column(db.String(200), nullable=False)
    venue_capacity = db.Column(db.Integer, nullable=False)
    shows = db.relationship('Shows', back_populates='venue', cascade = "all, delete-orphan")
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    admin = db.relationship('User', backref='venues')

class Shows(db.Model):
    __tablename__ = 'shows'
    show_id = db.Column(db.Integer, primary_key=True)
    show_name = db.Column(db.String(255), nullable=False)
    show_rating = db.Column(db.Float, nullable=False)
    show_genre = db.Column(db.String(100), nullable=False)
    show_date = db.Column(db.String(20), nullable=False)
    show_time = db.Column(db.String(20), nullable=False)
    show_price = db.Column(db.Integer, nullable=False)
    show_capacity = db.Column(db.Integer, nullable=False)
    show_img = db.Column(db.String(200), nullable=False)  
    show_revenue = db.Column(db.Integer, default=0)
    show_admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    show_admin = db.relationship("User", back_populates="created_shows")
    venue_id = db.Column(db.Integer, db.ForeignKey('venues.venue_id'))
    venue = db.relationship('Venues', back_populates='shows')
    bookings =db.relationship("Bookings", back_populates='show', cascade="all, delete-orphan")
    


class Ratings(db.Model):
    __tablename__="ratings"
    rating_id=db.Column(db.Integer, primary_key=True)
    ratings=db.Column(db.Integer, nullable=False)
    ruser_id=db.Column(db.Integer, db.ForeignKey('user.id'))
    rshow_id=db.Column(db.Integer, db.ForeignKey('shows.show_id'))
