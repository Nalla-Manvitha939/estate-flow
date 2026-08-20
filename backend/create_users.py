from uuid import uuid4

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


USERS = [
    {
        "name": "EstateFlow Admin",
        "email": "admin@estateflow.com",
        "password": "admin123",
        "role": "ADMIN",
    },
    {
        "name": "EstateFlow Owner",
        "email": "owner@estateflow.com",
        "password": "owner123",
        "role": "OWNER",
    },
    {
        "name": "EstateFlow Agent",
        "email": "agent@estateflow.com",
        "password": "agent123",
        "role": "AGENT",
    },
]


def create_or_update_users():
    db = SessionLocal()

    try:
        for user_data in USERS:
            existing_user = (
                db.query(User)
                .filter(User.email == user_data["email"])
                .first()
            )

            if existing_user:
                existing_user.name = user_data["name"]
                existing_user.role = user_data["role"]
                existing_user.password = hash_password(
                    user_data["password"]
                )

                print(
                    f"Updated: {user_data['email']} "
                    f"-> {user_data['role']}"
                )

            else:
                user = User(
                    id=str(uuid4()),
                    name=user_data["name"],
                    email=user_data["email"],
                    password=hash_password(
                        user_data["password"]
                    ),
                    role=user_data["role"],
                )

                db.add(user)

                print(
                    f"Created: {user_data['email']} "
                    f"-> {user_data['role']}"
                )

        db.commit()

        print()
        print("All staff accounts are ready.")
        print()
        print("ADMIN")
        print("Email: admin@estateflow.com")
        print("Password: admin123")
        print()
        print("OWNER")
        print("Email: owner@estateflow.com")
        print("Password: owner123")
        print()
        print("AGENT")
        print("Email: agent@estateflow.com")
        print("Password: agent123")

    except Exception as exc:
        db.rollback()
        print(f"Failed to create/update users: {exc}")

    finally:
        db.close()


if __name__ == "__main__":
    create_or_update_users()