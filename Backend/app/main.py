from fastapi import FastAPI
from app.config import settings
from app.database import engine, Base
from app import models
from app.routers import users
from app.routers import auth
from app.routers import posts

app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(posts.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Instagram Clone API 🚀",
        "database": settings.database_name
    }