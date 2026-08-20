import os

import resend


def send_password_reset_email(
    recipient_email: str,
    reset_link: str,
):
    resend_api_key = os.getenv("RESEND_API_KEY")
    resend_from = os.getenv("RESEND_FROM")

    if not resend_api_key or not resend_from:
        raise RuntimeError(
            "Resend configuration is missing. "
            "Check RESEND_API_KEY and RESEND_FROM."
        )

    resend.api_key = resend_api_key

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

    try:
        result = resend.Emails.send(
            {
                "from": resend_from,
                "to": [recipient_email],
                "subject": "EstateFlow - Reset Your Password",
                "html": html_content,
            }
        )

        return result

    except Exception as exc:
        raise RuntimeError(
            f"Failed to send password reset email: {exc}"
        ) from exc
