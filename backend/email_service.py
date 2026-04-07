import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_booking_confirmation(to_email: str, user_name: str, event_title: str, event_date: str, event_location: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"✅ Booking Confirmed: {event_title}"
    msg["From"] = smtp_user
    msg["To"] = to_email

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; color: white;">
          <h1 style="margin: 0;">Booking Confirmed! 🎉</h1>
        </div>
        <div style="padding: 24px;">
          <p>Hi {user_name},</p>
          <p>Your ticket for <strong>{event_title}</strong> has been successfully booked.</p>
          <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Event</td>
              <td style="padding: 10px;">{event_title}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Date</td>
              <td style="padding: 10px;">{event_date}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Location</td>
              <td style="padding: 10px;">{event_location}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #666;">See you there!</p>
        </div>
      </div>
    </body>
    </html>
    """
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, to_email, msg.as_string())
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email: {e}")
