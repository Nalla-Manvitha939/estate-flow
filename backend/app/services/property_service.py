from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.property import Property
from app.repositories.property_repository import PropertyRepository
from app.schemas.property import PropertyCreate, PropertyUpdate


class PropertyService:

    
    @staticmethod
    def is_admin(current_user) -> bool:
        """
        Check whether the logged-in user is an administrator.

        This supports common role implementations used in the
        existing authentication system.
        """

        if current_user is None:
            return False

        
        if getattr(current_user, "is_admin", False):
            return True

        if getattr(current_user, "is_superuser", False):
            return True

        
        role = getattr(current_user, "role", None)

        if role is None:
            return False

        
        role_value = getattr(role, "value", role)

        role_value = str(role_value).strip().lower()

        return role_value in {
            "admin",
            "administrator",
            "super_admin",
            "superadmin",
        }

    

    @staticmethod
    def create_property(
        db: Session,
        owner_id: str,
        data: PropertyCreate,
    ) -> Property:

        property_data = data.model_dump()

        
        property_data["id"] = (
            property_data.get("id")
            or str(uuid4())
        )

        
        property_data["owner_id"] = (
            property_data.get("owner_id")
            or owner_id
        )

        
        property_data["status"] = "AVAILABLE"

        
        if not property_data.get("availability"):
            property_data["availability"] = "AVAILABLE"

        
        if property_data.get("amenities") is None:
            property_data["amenities"] = []

        
        if property_data.get("images") is None:
            property_data["images"] = []

        
        if property_data.get("documents") is None:
            property_data["documents"] = []

        return PropertyRepository.create(
            db=db,
            property_data=property_data,
        )

    

    @staticmethod
    def get_property(
        db: Session,
        property_id: str,
    ) -> Property:

        property = PropertyRepository.get_by_id(
            db=db,
            property_id=property_id,
        )

        if not property:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found",
            )

        return property

    

    @staticmethod
    def get_properties(
        db: Session,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Property]:

        return PropertyRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
        )

    

    @staticmethod
    def get_owner_properties(
        db: Session,
        owner_id: str,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Property]:

        return PropertyRepository.get_by_owner(
            db=db,
            owner_id=owner_id,
            skip=skip,
            limit=limit,
        )

    

    @staticmethod
    def update_property(
        db: Session,
        property_id: str,
        current_user,
        data: PropertyUpdate,
    ) -> Property:

        

        property = PropertyService.get_property(
            db=db,
            property_id=property_id,
        )

        
        is_admin = PropertyService.is_admin(
            current_user
        )

        if not is_admin:

            if str(property.owner_id) != str(current_user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not allowed to update this property",
                )

        

        update_data = data.model_dump(
            exclude_unset=True
        )

        

        if "owner_id" in update_data:
            if update_data["owner_id"] is None:
                update_data.pop("owner_id")

        

        updated_property = PropertyRepository.update(
            db=db,
            property=property,
            property_data=update_data,
        )

        return updated_property

    

    @staticmethod
    def delete_property(
        db: Session,
        property_id: str,
        current_user,
    ) -> None:

        

        property = PropertyService.get_property(
            db=db,
            property_id=property_id,
        )

        

        is_admin = PropertyService.is_admin(
            current_user
        )

        if not is_admin:

            if str(property.owner_id) != str(current_user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not allowed to delete this property",
                )

        

        PropertyRepository.delete(
            db=db,
            property=property,
        )

    

    @staticmethod
    def search_properties(
        db: Session,
        city: Optional[str] = None,
        property_type: Optional[str] = None,
        listing_type: Optional[str] = None,
        status: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Property]:

        return PropertyRepository.search(
            db=db,
            city=city,
            property_type=property_type,
            listing_type=listing_type,
            status=status,
            min_price=min_price,
            max_price=max_price,
            skip=skip,
            limit=limit,
        )