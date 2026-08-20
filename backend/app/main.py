from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.properties import router as property_router
from app.api.v1.endpoints.users import router as users_router


app = FastAPI(
    title="EstateFlow API",
    description="Backend API for EstateFlow Real Estate Management System",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router,
    prefix="/api/v1",
)

app.include_router(
    property_router,
    prefix="/api/v1",
)

app.include_router(
    users_router,
    prefix="/api/v1",
)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "EstateFlow API is running",
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "EstateFlow API is healthy",
    }