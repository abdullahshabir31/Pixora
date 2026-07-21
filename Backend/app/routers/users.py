from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app import utils
from app import oauth2
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=utils.hash(user.password),
        full_name=user.full_name,
        bio=user.bio
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user(current_user: models.User = Depends(oauth2.get_current_user)):
    return current_user