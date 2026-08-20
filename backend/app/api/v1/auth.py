from datetime import datetime, timedelta, timezone
from uuid import uuid4
import hashlib
import os
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.core.email import send_password_reset_email
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)




class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str



@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    user = User(
        id=str(uuid4()),
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        {
            "sub": user.id,
            "email": user.email,
        }
    )

    return {
        "message": "Registration successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }




@router.post(
    "/login",
    response_model=AuthResponse,
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        data.password,
        user.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {
            "sub": user.id,
            "email": user.email,
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }




@router.post(
    "/forgot-password",
)
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    
    if not user:
        return {
            "message": (
                "If an account with that email exists, "
                "a password reset link has been sent."
            )
        }

    
    raw_token = secrets.token_urlsafe(32)

    
    token_hash = hashlib.sha256(
        raw_token.encode()
    ).hexdigest()

    
    user.reset_token = token_hash

    
    user.reset_token_expires = (
        datetime.now(timezone.utc)
        + timedelta(minutes=30)
    )

    db.commit()

    
    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000",
    )

    # Create reset URL
    reset_url = (
        f"{frontend_url}/reset-password"
        f"?token={raw_token}"
    )

    # Send email
    # email.py expects the parameter name reset_link
    send_password_reset_email(
        recipient_email=user.email,
        reset_link=reset_url,
    )

    return {
        "message": (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )
    }




@router.post(
    "/reset-password",
)
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    
    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )

    
    token_hash = hashlib.sha256(
        data.token.encode()
    ).hexdigest()

    
    user = (
        db.query(User)
        .filter(User.reset_token == token_hash)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link",
        )

    
    if not user.reset_token_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link",
        )

    
    if user.reset_token_expires < datetime.now(timezone.utc):
        user.reset_token = None
        user.reset_token_expires = None

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link",
        )

    
    user.password = hash_password(
        data.new_password
    )

    
    user.reset_token = None
    user.reset_token_expires = None

    db.commit()

    return {
        "message": "Password reset successfully",
    }