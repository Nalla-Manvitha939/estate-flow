from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime

from app.core.database import Base


class User(Base):
    __tablename__ = "User"

    id = Column(
        String,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    password = Column(
        String,
        nullable=False,
    )

    role = Column(
        String,
        nullable=False,
        default="CUSTOMER",
        server_default="CUSTOMER",
        index=True,
    )

    reset_token = Column(
        String,
        nullable=True,
        unique=True,
        index=True,
    )

    reset_token_expires = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    createdAt = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updatedAt = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )