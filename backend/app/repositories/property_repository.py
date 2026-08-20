from typing import Optional

from sqlalchemy.orm import Session

from app.models.property import Property


class PropertyRepository:

    @staticmethod
    def create(
        db: Session,
        property_data: dict,
    ) -> Property:
        property = Property(**property_data)

        db.add(property)
        db.commit()
        db.refresh(property)

        return property

    @staticmethod
    def get_by_id(
        db: Session,
        property_id: str,
    ) -> Optional[Property]:
        return (
            db.query(Property)
            .filter(Property.id == property_id)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Property]:
        return (
            db.query(Property)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_owner(
        db: Session,
        owner_id: str,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Property]:
        return (
            db.query(Property)
            .filter(Property.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        property: Property,
        property_data: dict,
    ) -> Property:
        for field, value in property_data.items():
            if value is not None:
                setattr(property, field, value)

        db.commit()
        db.refresh(property)

        return property

    @staticmethod
    def delete(
        db: Session,
        property: Property,
    ) -> None:
        db.delete(property)
        db.commit()

    @staticmethod
    def search(
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

        query = db.query(Property)

        if city:
            query = query.filter(
                Property.city.ilike(f"%{city}%")
            )

        if property_type:
            query = query.filter(
                Property.property_type == property_type
            )

        if listing_type:
            query = query.filter(
                Property.listing_type == listing_type
            )

        if status:
            query = query.filter(
                Property.status == status
            )

        if min_price is not None:
            query = query.filter(
                Property.price >= min_price
            )

        if max_price is not None:
            query = query.filter(
                Property.price <= max_price
            )

        return (
            query
            .offset(skip)
            .limit(limit)
            .all()
        )