from datetime import datetime

from pydantic import BaseModel, Field


class PropertyCreate(BaseModel):
    id: str | None = None
    owner_id: str | None = None
    owner_name: str = Field(default="", max_length=200)
    agent_id: str | None = None
    agent_name: str | None = Field(default=None, max_length=200)

    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10)

    property_type: str
    listing_type: str

    price: float = Field(gt=0)
    location: str
    city: str
    state: str
    pincode: str | None = None

    bedrooms: int = Field(ge=0)
    bathrooms: int = Field(ge=0)
    area: float = Field(gt=0)

    amenities: list[str] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)
    documents: list[str] = Field(default_factory=list)

    availability: str = "AVAILABLE"
    listed_date: datetime | None = None


class PropertyUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, min_length=10)

    property_type: str | None = None
    listing_type: str | None = None

    price: float | None = Field(default=None, gt=0)
    location: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None

    bedrooms: int | None = Field(default=None, ge=0)
    bathrooms: int | None = Field(default=None, ge=0)
    area: float | None = Field(default=None, gt=0)

    owner_id: str | None = None
    owner_name: str | None = None
    agent_id: str | None = None
    agent_name: str | None = None

    amenities: list[str] | None = None
    images: list[str] | None = None
    documents: list[str] | None = None

    availability: str | None = None
    listed_date: datetime | None = None
    status: str | None = None


class PropertyResponse(BaseModel):
    id: str

    owner_id: str
    owner_name: str

    agent_id: str | None
    agent_name: str | None

    title: str
    description: str

    property_type: str
    listing_type: str

    price: float
    location: str
    city: str
    state: str
    pincode: str | None

    bedrooms: int
    bathrooms: int
    area: float

    amenities: list[str]
    images: list[str]
    documents: list[str]

    availability: str
    listed_date: datetime | None

    status: str

    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True