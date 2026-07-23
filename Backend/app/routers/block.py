from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/users",
    tags=["Block"]
)


# Block User
@router.post("/{user_id}/block", status_code=status.HTTP_201_CREATED)
def block_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot block yourself"
        )


    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    existing_block = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == user_id
    ).first()


    if existing_block:
        raise HTTPException(
            status_code=400,
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



# Unblock User
@router.delete("/{user_id}/block")
def unblock_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    block = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == user_id
    ).first()


    if not block:
        raise HTTPException(
            status_code=404,
            detail="Block not found"
        )


    db.delete(block)
    db.commit()


    return {
        "message": "User unblocked successfully"
    }



# Get Blocked Users
@router.get("/me/blocked-users")
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