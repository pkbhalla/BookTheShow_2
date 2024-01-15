from applications.models import *
from flask import current_app as capp
from flask import render_template
from datetime import date
from jinja2 import Template
import csv, os
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from celery.schedules import crontab
from applications.workers import celery
from applications.mailer import sendMail, sendMemer
from datetime import datetime, timedelta
from pytz import timezone

@celery.task
def send_daily_reminders():
    ist = timezone('Asia/Kolkata')
    now = datetime.now(ist)

    last_visit_threshold = now - timedelta(hours=24)
    users_to_remind = User.query.filter((User.last_visit < last_visit_threshold) | (User.last_visit == None), User.is_admin==0).all()

    for user in users_to_remind:
        subject = "Reminder: Visit/Book Shows on BookTheShow"
        message = f"Hello {user.name},<br><br>You haven't visited or booked any shows recently. We encourage you to explore and book shows on BookTheShow. Don't miss out on exciting events!<br><br>Regards,<br>BookTheShow Team"
        sendMail(user.email, subject, message)
    return f"Daily reminders sent to {len(users_to_remind)} users"



@celery.task
def send_monthly_report():
    # Calculating the date range for the previous month
    today = datetime.today()
    first_day_of_previous_month = datetime(today.year, today.month - 1, 1)
    last_day_of_previous_month = first_day_of_previous_month.replace(day=28) + timedelta(days=4)
    users = User.query.filter_by(is_admin=0).all()
    for user in users:

        # Query bookings made in the previous month
        bookings = Bookings.query.filter(
            Bookings.user_id==user.id,
            Bookings.booking_datetime >= first_day_of_previous_month,
            Bookings.booking_datetime <= last_day_of_previous_month
        ).all()

        # bookings = Bookings.query.filter(Bookings.user_id==user.id).all()
        report_data = []
        for booking in bookings:
            show = Shows.query.get(booking.show_id)
            report_data.append({
                'user_name': user.name,
                'show_name': show.show_name,
                'show_date': show.show_date,
                'show_rating': show.show_rating
            })

        env = Environment(loader=FileSystemLoader('.'))
        template = env.get_template('./templates/reporter.html')
        html_report = template.render(report_data=report_data, user_name = user.name)

        subject = "Monthly Entertainment Report"
        recipient_email = user.email 
        sendMail(recipient_email, subject, html_report)

    return "Monthly report generated and sent to all users."


@celery.task
def export_venue_to_csv_email(venue_id, current_user_email):
    venue = Venues.query.get(venue_id)
    shows_df = pd.DataFrame([
    {   'show_id': show.show_id,
        'show_name': show.show_name,
        'show_revenue': show.show_revenue,
        'show_rating': show.show_rating }for show in venue.shows])
    num_shows = len(shows_df)
    total_revenue = shows_df['show_revenue'].sum()
    avg_rating = shows_df['show_rating'].mean()
    max_rating = shows_df['show_rating'].max()
    min_rating = shows_df['show_rating'].min()

    headers = ['Venue ID', 'Venue Name', 'Venue Place', 'Venue Location', 'Venue Capacity', 'Number of Shows', 'Total Revenue', 'Average Rating', 'Maximum Rating', 'Minimum Rating']
    values = [venue.venue_id, venue.venue_name, venue.venue_place, venue.venue_location, venue.venue_capacity, num_shows, total_revenue, avg_rating, max_rating, min_rating]

    file_name = f'venue_{venue_id}_export.csv'
    with open(file_name, 'w') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerow(values)
    try:
        subject = f'Venue {venue_id} Export'
        body = f'Hi {current_user_email},\n\nHere is your requested export of venue {venue.venue_name} details.\n\nPlease find the attached CSV file.\n\nThank you.'
        sendMemer(current_user_email, subject, body, attachment=file_name)
        os.remove(file_name)
        return {'message': f'Venue {venue_id} export completed and emailed to {current_user_email}'}, 200
    except Exception as e:
        os.remove(file_name)
        return {'message': f'An error occurred while sending the email: {e}'}, 500


@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):

    sender.add_periodic_task(10, send_daily_reminders.s(), name='Daily_Reminder') 
    sender.add_periodic_task(10, send_monthly_report.s(), name='Monthly_Report')



celery.conf.beat_schedule = {
    'send-monthly-report': {
        'task': 'applications.tasks.send_monthly_report',
        'schedule': crontab(day_of_month='1', hour='0', minute='0'),
    },
    'send-daily-reminder': {
        'task': 'applications.tasks.send_daily_reminders',
        'schedule': crontab(hour=20, minute=0),  # 8 PM IST
    },
}

