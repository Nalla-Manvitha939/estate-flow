from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository


class UserService:

    @staticmethod
    def get_users(
        db: Session,
        role: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ):

        if role:
            allowed_roles = {
                "ADMIN",
                "OWNER",
                "AGENT",
                "CUSTOMER",
            }

            normalized_role = role.strip().upper()

            if normalized_role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Invalid role. Allowed roles: "
                        "ADMIN, OWNER, AGENT, CUSTOMER"
                    ),
                )

            return UserRepository.get_by_role(
                db=db,
                role=normalized_role,
                skip=skip,
                limit=limit,
            )

        return UserRepository.get_all(
            db=db,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    def get_user(
        db: Session,
        user_id: str,
    ):

        user = UserRepository.get_by_id(
            db=db,
            user_id=user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user