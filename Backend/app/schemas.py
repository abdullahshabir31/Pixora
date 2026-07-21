from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str | None = None
    bio: str | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str | None
    bio: str | None
    profile_image: str | None
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PostCreate(BaseModel):
    caption: str | None = None
    image_url: str


class PostResponse(BaseModel):
    id: int
    caption: str | None
    image_url: str
    owner_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }