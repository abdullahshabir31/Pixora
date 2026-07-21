from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/users",
    tags=["Follows"]
)

@router.post("/{user_id}/follow",
             status_code=status.HTTP_201_CREATED,
             response_model=schemas.FollowResponse)
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot follow yourself"
        )


    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    existing_follow = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user.id,
        models.Follow.following_id == user_id
    ).first()


    if existing_follow:
        raise HTTPException(
            status_code=400,
            detail="Already following this user"
        )


    new_follow = models.Follow(
        follower_id=current_user.id,
        following_id=user_id
    )


    db.add(new_follow)
    db.commit()
    db.refresh(new_follow)


    return new_follow

@router.delete("/{user_id}/follow")
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    follow = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user.id,
        models.Follow.following_id == user_id
    ).first()


    if not follow:
        raise HTTPException(
            status_code=404,
            detail="Follow not found"
        )


    db.delete(follow)
    db.commit()


    return {
        "message": "Unfollowed successfully"
    }

@router.get("/{user_id}/followers")
def get_followers(
    user_id: int,
    db: Session = Depends(get_db)
):

    followers = db.query(models.Follow).filter(
        models.Follow.following_id == user_id
    ).all()


    return {
        "total_followers": len(followers),
        "followers": followers
    }

@router.get("/{user_id}/following")
def get_following(
    user_id: int,
    db: Session = Depends(get_db)
):

    following = db.query(models.Follow).filter(
        models.Follow.follower_id == user_id
    ).all()


    return {
        "total_following": len(following),
        "following": following
    }