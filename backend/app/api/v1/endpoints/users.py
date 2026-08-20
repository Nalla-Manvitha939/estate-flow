from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserBasicResponse
from app.services.user_service import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "",
    response_model=list[UserBasicResponse],
)
def get_users(
    role: Optional[str] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return UserService.get_users(
        db=db,
        role=role,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{user_id}",
    response_model=UserBasicResponse,
)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
):
    return UserService.get_user(
        db=db,
        user_id=user_id,
    )