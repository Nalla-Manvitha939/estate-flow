import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_password_reset_email(
    recipient_email: str,
    reset_link: str,
):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM")

    if not smtp_username or not smtp_password or not smtp_from:
        raise RuntimeError(
            "SMTP configuration is missing. "
            "Check SMTP_USERNAME, SMTP_PASSWORD and SMTP_FROM in .env"
        )

    message = MIMEMultipart("alternative")

    message["Subject"] = "EstateFlow - Reset Your Password"
    message["From"] = smtp_from
    message["To"] = recipient_email

    html_content = f"""
<!DOCTYPE html>
<html>
<body style="
    margin: 0;
    padding: 40px;
    background-color: #061A3A;
    font-family: Arial, sans-serif;
">
    <div style="
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 20px;
    ">

        <h1 style="
            margin: 0 0 10px;
            color: #061A3A;
        ">
            Estate<span style="color: #2563EB;">Flow</span>
        </h1>

        <h2 style="color: #0F172A;">
            Reset Your Password
        </h2>

        <p style="
            color: #475569;
            line-height: 1.6;
        ">
            We received a request to reset your EstateFlow password.
        </p>

        <p style="
            color: #475569;
            line-height: 1.6;
        ">
            Click the button below to create a new password.
        </p>

        <div style="margin: 30px 0;">
            <a
                href="{reset_link}"
                style="
                    display: inline-block;
                    background: #2563EB;
                    color: #ffffff;
                    padding: 14px 24px;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: bold;
                "
            >
                Reset Password
            </a>
        </div>

        <p style="
            color: #64748B;
            font-size: 13px;
            line-height: 1.6;
        ">
            This password reset link will expire in 30 minutes.
        </p>

        <p style="
            color: #94A3B8;
            font-size: 12px;
            line-height: 1.6;
        ">
            If you did not request a password reset, you can safely
            ignore this email. Your password will remain unchanged.
        </p>

        <hr style="
            margin: 30px 0;
            border: none;
            border-top: 1px solid #E2E8F0;
        ">

        <p style="
            color: #94A3B8;
            font-size: 12px;
        ">
            EstateFlow · Modern Real Estate Management
        </p>

    </div>
</body>
</html>
"""

    message.attach(
        MIMEText(html_content, "html")
    )

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()

            server.login(
                smtp_username,
                smtp_password,
            )

            server.sendmail(
                smtp_from,
                recipient_email,
                message.as_string(),
            )

    except smtplib.SMTPException as exc:
        raise RuntimeError(
            f"Failed to send password reset email: {exc}"
        ) from exc