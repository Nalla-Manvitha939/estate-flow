from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.property import (
    PropertyCreate,
    PropertyResponse,
    PropertyUpdate,
)
from app.services.property_service import PropertyService

router = APIRouter(
    prefix="/properties",
    tags=["Properties"],
)


@router.post(
    "",
    response_model=PropertyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_property(
    data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Creates a new property, mapping incoming camelCase or manual IDs safely.
    """
    payload_data = data.dict()
    
    
    owner_id = payload_data.get("owner_id") or payload_data.get("propertyId")
    owner_name = payload_data.get("owner_name") or payload_data.get("ownerName")

    if not owner_id and hasattr(current_user, "id"):
        owner_id = current_user.id
    if not owner_name and hasattr(current_user, "name"):
        owner_name = current_user.name

    payload_data["owner_id"] = owner_id
    payload_data["owner_name"] = owner_name

    return PropertyService.create_property(
        db=db,
        owner_id=owner_id,
        data=PropertyCreate(**payload_data),
    )


@router.get(
    "",
    response_model=list[PropertyResponse],
)
def get_properties(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return PropertyService.get_properties(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/my-properties",
    response_model=list[PropertyResponse],
)
def get_my_properties(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PropertyService.get_owner_properties(
        db=db,
        owner_id=current_user.id,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/search",
    response_model=list[PropertyResponse],
)
def search_properties(
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    listing_type: Optional[str] = None,
    property_status: Optional[str] = None,
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return PropertyService.search_properties(
        db=db,
        city=city,
        property_type=property_type,
        listing_type=listing_type,
        status=property_status,
        min_price=min_price,
        max_price=max_price,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{property_id}",
    response_model=PropertyResponse,
)
def get_property(
    property_id: str,
    db: Session = Depends(get_db),
):
    return PropertyService.get_property(
        db=db,
        property_id=property_id,
    )


@router.put(
    "/{property_id}",
    response_model=PropertyResponse,
)
def update_property(
    property_id: str,
    data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PropertyService.update_property(
        db=db,
        property_id=property_id,
        owner_id=current_user.id,
        data=data,
    )


@router.delete(
    "/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_property(
    property_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    PropertyService.delete_property(
        db=db,
        property_id=property_id,
        owner_id=current_user.id,
    )

    return None