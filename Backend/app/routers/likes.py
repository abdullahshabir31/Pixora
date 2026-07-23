from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/posts",
    tags=["Likes"]
)

@router.post("/{post_id}/like", status_code=status.HTTP_201_CREATED)
def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )


    existing_like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == current_user.id
    ).first()


    if existing_like:
        raise HTTPException(
            status_code=400,
            detail="Already liked"
        )


    new_like = models.Like(
        post_id=post_id,
        user_id=current_user.id
    )


    db.add(new_like)
    db.commit()
    db.refresh(new_like)


# Create Like Notification
    if post.owner_id != current_user.id:

        notification = models.Notification(
        sender_id=current_user.id,
        receiver_id=post.owner_id,
        type="like",
        message=f"{current_user.username} liked your post"
    )

    db.add(notification)
    db.commit()


    return new_like

@router.delete("/{post_id}/like")
def unlike_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == current_user.id
    ).first()


    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found"
        )


    db.delete(like)
    db.commit()


    return {
        "message": "Post unliked successfully"
    }

@router.get("/{post_id}/likes")
def get_post_likes(
    post_id: int,
    db: Session = Depends(get_db)
):

    likes = db.query(models.Like).filter(
        models.Like.post_id == post_id
    ).all()


    return {
        "total_likes": len(likes),
        "likes": likes
    }