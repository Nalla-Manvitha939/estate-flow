from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, Text

from app.core.database import Base


class Property(Base):
    __tablename__ = "Property"

    id = Column(
        String,
        primary_key=True,
        index=True,
    )

    owner_id = Column(
        String,
        ForeignKey("User.id"),
        nullable=False,
        index=True,
    )

    owner_name = Column(
        String,
        nullable=False,
    )

    agent_id = Column(
        String,
        nullable=True,
        index=True,
    )

    agent_name = Column(
        String,
        nullable=True,
    )

    title = Column(
        String,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    property_type = Column(
        String,
        nullable=False,
        index=True,
    )

    listing_type = Column(
        String,
        nullable=False,
        index=True,
    )

    price = Column(
        Float,
        nullable=False,
    )

    location = Column(
        String,
        nullable=False,
        index=True,
    )

    city = Column(
        String,
        nullable=False,
        index=True,
    )

    state = Column(
        String,
        nullable=False,
    )

    pincode = Column(
        String,
        nullable=True,
    )

    bedrooms = Column(
        Integer,
        nullable=False,
        default=0,
    )

    bathrooms = Column(
        Integer,
        nullable=False,
        default=0,
    )

    area = Column(
        Float,
        nullable=False,
    )

    amenities = Column(
        JSON,
        nullable=False,
        default=list,
    )

    images = Column(
        JSON,
        nullable=False,
        default=list,
    )

    documents = Column(
        JSON,
        nullable=False,
        default=list,
    )

    availability = Column(
        String,
        nullable=False,
        default="AVAILABLE",
        server_default="AVAILABLE",
        index=True,
    )

    listed_date = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    status = Column(
        String,
        nullable=False,
        default="AVAILABLE",
        server_default="AVAILABLE",
        index=True,
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