from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, oauth2, schemas


router = APIRouter(
    prefix="/posts",
    tags=["Comments"]
)


@router.post(
    "/{post_id}/comments",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.CommentResponse,
    summary="Create a comment",
    description="""
Create a new comment on a Pixora post.

This endpoint allows an authenticated user to add a comment on an existing post.
A notification is created for the post owner when another user comments on their post.

Returns:
- Comment information
- Comment owner details
- Related post information

Requirements:
- User must be authenticated.
- Post must exist.
- User must not be blocked by the post owner.
- User must not have blocked the post owner.
"""
)
def create_comment(
    comment: schemas.CommentCreate,
    post_id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post where you want to add a comment.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Check post exists
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if post owner blocked current user
    blocked = db.query(models.Block).filter(
        models.Block.blocker_id == post.owner_id,
        models.Block.blocked_id == current_user.id
    ).first()

    if blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are blocked by this user"
        )

    # Check if current user blocked post owner
    blocked_by_you = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == post.owner_id
    ).first()

    if blocked_by_you:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You blocked this user"
        )

    # Create comment
    new_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(new_comment)

    # Create notification
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
    response_model=list[schemas.CommentResponse],
    summary="Get post comments",
    description="""
Retrieve all comments of a specific Pixora post.

This endpoint fetches all comments associated with a post and returns them in chronological order.

Returns:
- List of comments
- Comment information
- Comment owner details

Requirements:
- A valid post ID is required.
"""
)
def get_comments(
    post_id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post whose comments you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db)
):
    comments = (
        db.query(models.Comment)
        .filter(models.Comment.post_id == post_id)
        .order_by(models.Comment.created_at.asc())
        .all()
    )

    return comments


@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a comment",
    description="""
Delete a comment from Pixora.

This endpoint allows an authenticated user to remove their own comment from a post.

Returns:
- Success message after deleting the comment.

Requirements:
- User must be authenticated.
- Comment must exist.
- Only the comment owner can delete the comment.

Access is denied if:
- The comment does not exist.
- The authenticated user is not the owner of the comment.
"""
)
def delete_comment(
    comment_id: int = Path(
        ...,
        title="Comment ID",
        description="Unique ID of the comment that you want to delete.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()

    if comment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed"
        )

    db.delete(comment)
    db.commit()

    return {
        "message": "Comment deleted successfully"
    }