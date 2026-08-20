from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        return (
            db.query(User)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: str,
    ) -> Optional[User]:
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def get_by_role(
        db: Session,
        role: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        return (
            db.query(User)
            .filter(User.role == role.upper())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> Optional[User]:
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )