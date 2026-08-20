from datetime import datetime

from pydantic import BaseModel


class UserBasicResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True