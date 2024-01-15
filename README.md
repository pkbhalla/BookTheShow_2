# BookTheShow_2
A web app for booking tickets of shows for users, and to create venues, shows inside venues for admins made using Flask Restful APIs in backend, Vue js in frontend with Backend jobs using Celery.

## Create virtual environment using the below command in terminal
```python -m venv virtual_environment_name```

## To run the app, first install the requirements.txt using
```pip install -r requirements.txt```

## Run main.py using
```python main.py```

## Start redis server on windows
```sudo service redis-server start```

```redis-server```

## Start worker in ubuntu
```celery -A main.celery worker -l info```

## Start beat in windows
```celery -A main.celery beat --max-interval 1 -l info```

## Start mailhog
```mailhog```

### Mailhog server will run at 
```http://127.0.0.1:5000:8025```
