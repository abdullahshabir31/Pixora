from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, oauth2, utils

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

@router.get("/me", response_model=schemas.ProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    posts_count = db.query(models.Post).filter(
        models.Post.owner_id == current_user.id
    ).count()


    followers_count = db.query(models.Follow).filter(
        models.Follow.following_id == current_user.id
    ).count()


    following_count = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user.id
    ).count()


    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count
    }

@router.get("/profile/{user_id}", response_model=schemas.ProfileResponse)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    posts_count = db.query(models.Post).filter(
        models.Post.user_id == user_id
    ).count()


    followers_count = db.query(models.Follow).filter(
        models.Follow.following_id == user_id
    ).count()


    following_count = db.query(models.Follow).filter(
        models.Follow.follower_id == user_id
    ).count()


    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count
    }

@router.get("/search", response_model=list[schemas.UserSearchResponse])
def search_users(
    username: str,
    db: Session = Depends(get_db)
):

    users = db.query(models.User).filter(
        models.User.username.ilike(f"%{username}%")
    ).all()


    return users