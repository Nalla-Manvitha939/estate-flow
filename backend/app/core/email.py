import os
import requests


def send_password_reset_email(
    recipient_email: str,
    reset_link: str,
):
    brevo_api_key = os.getenv("BREVO_API_KEY")
    brevo_from_email = os.getenv("SMTP_FROM")
    brevo_from_name = os.getenv(
        "SMTP_FROM_NAME",
        "EstateFlow",
    )

    if not brevo_api_key:
        raise RuntimeError(
            "BREVO_API_KEY is missing."
        )

    if not brevo_from_email:
        raise RuntimeError(
            "SMTP_FROM is missing."
        )

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>EstateFlow Password Reset</title>
</head>

<body style="
    margin: 0;
    padding: 40px;
    background-color: #061A3A;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 20px;
    ">

        <h1 style="
            margin: 0 0 10px;
            color: #061A3A;
            font-size: 32px;
        ">
            Estate<span style="color: #2563EB;">Flow</span>
        </h1>

        <h2 style="
            color: #0F172A;
            margin-top: 30px;
        ">
            Reset Your Password
        </h2>

        <p style="
            color: #475569;
            line-height: 1.6;
        ">
            We received a request to reset your
            EstateFlow password.
        </p>

        <p style="
            color: #475569;
            line-height: 1.6;
        ">
            Click the button below to create a new
            password.
        </p>

        <div style="
            margin: 30px 0;
        ">
            <a
                href="{reset_link}"
                style="
                    display: inline-block;
                    background-color: #2563EB;
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
            This password reset link will expire
            in 30 minutes.
        </p>

        <p style="
            color: #94A3B8;
            font-size: 12px;
            line-height: 1.6;
        ">
            If you did not request a password reset,
            you can safely ignore this email.
            Your password will remain unchanged.
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

    payload = {
        "sender": {
            "name": brevo_from_name,
            "email": brevo_from_email,
        },
        "to": [
            {
                "email": recipient_email,
            }
        ],
        "subject": "EstateFlow - Reset Your Password",
        "htmlContent": html_content,
    }

    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json",
    }

    try:
        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers=headers,
            json=payload,
            timeout=30,
        )

        if not response.ok:
            try:
                error_data = response.json()
                error_message = (
                    error_data.get("message")
                    or error_data.get("code")
                    or response.text
                )
            except Exception:
                error_message = response.text

            raise RuntimeError(
                f"Brevo email API failed "
                f"({response.status_code}): "
                f"{error_message}"
            )

        return response.json()

    except requests.RequestException as exc:
        raise RuntimeError(
            f"Failed to connect to Brevo email API: {exc}"
        ) from exc
