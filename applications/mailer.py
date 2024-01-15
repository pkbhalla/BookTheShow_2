from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText
import smtplib 


SMTP_SERVER_HOST= "localhost"
SMTP_SERVER_PORT= 1025
SENDER_ADDRESS = "booktheshow@gmail.com"
SENDER_PASSWORD = ""


def sendMail(reciever, subject, message):
    msg=MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = reciever
    msg["Subject"] = subject

    msg.attach(MIMEText(message,"html"))
    
    s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)

    s.send_message(msg)
    s.quit()
    return True


def sendMemer(reciever, subject, message, content='html', attachment = None):
    msg = MIMEMultipart()
    msg['To']=reciever
    msg['From']=SENDER_ADDRESS
    msg['Subject']=subject

    msg.attach(MIMEText(message,"html"))
    
    if attachment:
        with open(attachment,"r") as a:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(a.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment: filename={attachment}")
        msg.attach(part)  

    s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)

    s.send_message(msg)
    print("sended")
    s.quit()
    return True

