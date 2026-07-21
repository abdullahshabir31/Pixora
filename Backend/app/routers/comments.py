from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/posts",
    tags=["Comments"]
)

@router.post("/{post_id}/comments", 
             status_code=status.HTTP_201_CREATED,
             response_model=schemas.CommentResponse)
def create_comment(
    post_id: int,
    comment: schemas.CommentCreate,
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


    new_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id
    )


    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)


    return new_comment

@router.get("/{post_id}/comments",
            response_model=list[schemas.CommentResponse])
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