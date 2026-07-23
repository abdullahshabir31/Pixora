from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/posts",
    tags=["Comments"]
)


@router.post(
    "/{post_id}/comments",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.CommentResponse
)
def create_comment(
    post_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    # Check post exists
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()


    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )


    # Check if post owner blocked current user
    blocked = db.query(models.Block).filter(
        models.Block.blocker_id == post.owner_id,
        models.Block.blocked_id == current_user.id
    ).first()


    if blocked:
        raise HTTPException(
            status_code=403,
            detail="You are blocked by this user"
        )


    # Check if current user blocked post owner
    blocked_by_you = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == post.owner_id
    ).first()


    if blocked_by_you:
        raise HTTPException(
            status_code=403,
            detail="You blocked this user"
        )


    # Create Comment
    new_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id
    )


    db.add(new_comment)


    # Create Comment Notification
    if post.owner_id != current_user.id:

        notification = models.Notification(
            sender_id=current_user.id,
            receiver_id=post.owner_id,
            type="comment",
            message=f"{current_user.username} commented on your post"
        )

        db.add(notification)


    db.commit()
    db.refresh(new_comment)


    return new_comment



@router.get(
    "/{post_id}/comments",
    response_model=list[schemas.CommentResponse]
)
def get_comments(
    post_id: int,
    db: Session = Depends(get_db)
):

    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).all()


    return comments



@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()


    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )


    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )


    db.delete(comment)
    db.commit()


    return {
        "message": "Comment deleted successfully"
    }