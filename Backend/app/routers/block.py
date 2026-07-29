from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, oauth2


router = APIRouter(
    prefix="/users",
    tags=["Block"]
)


@router.post(
    "/{user_id}/block",
    status_code=status.HTTP_201_CREATED,
    summary="Block a user",
    description="""
Block another Pixora user.

This endpoint allows an authenticated user to block another user.
Blocked users cannot interact with the current user's content and features.

Returns:
- Success message after blocking the user.

Requirements:
- User must be authenticated.
- Target user must exist.
- User cannot block themselves.

Errors:
- User not found.
- User already blocked.
"""
)
def block_user(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user that you want to block.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot block yourself"
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    existing_block = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == user_id
    ).first()

    if existing_block:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already blocked"
        )

    new_block = models.Block(
        blocker_id=current_user.id,
        blocked_id=user_id
    )

    db.add(new_block)
    db.commit()
    db.refresh(new_block)

    return {
        "message": "User blocked successfully"
    }


@router.delete(
    "/{user_id}/block",
    summary="Unblock a user",
    description="""
Remove a user from the blocked list.

This endpoint allows an authenticated user to unblock a previously blocked user.

Returns:
- Success message after unblocking.

Requirements:
- User must be authenticated.
- Block record must exist.
"""
)
def unblock_user(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user that you want to unblock.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    block = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == user_id
    ).first()

    if block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )

    db.delete(block)
    db.commit()

    return {
        "message": "User unblocked successfully"
    }


@router.get(
    "/me/blocked-users",
    summary="Get blocked users",
    description="""
Retrieve all users blocked by the authenticated user.

Returns:
- Total number of blocked users.
- List of blocked users.

Requirements:
- User must be authenticated.
"""
)
def get_blocked_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    blocked_users = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id
    ).all()

    return {
        "total_blocked": len(blocked_users),
        "blocked_users": blocked_users
    }