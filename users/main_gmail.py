import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

def auth_code(new_password, receiver_email):
    try:
        print('test')
        print('test')
        print('test')
        print('test')

        sender_email = "gijungcpy@gmail.com"
        app_password = "mbvwslcnzmbnwykb"
        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        subject = f"[기영F&B] 과금조회 임시비밀번호 ::: {current_time}"
        html = f"<html><body><p style='font-size: 30px;'>{new_password}</p></body></html>"

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = sender_email
        message["To"] = receiver_email

        part1 = MIMEText(new_password, "plain")
        part2 = MIMEText(html, "html")

        message.attach(part1)
        message.attach(part2)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except:
        new_password = 'wrong'
    return new_password
