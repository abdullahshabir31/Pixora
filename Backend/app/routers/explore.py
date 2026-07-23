from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app import models, oauth2


router = APIRouter(
    prefix="/explore",
    tags=["Explore"]
)



# Search Users
@router.get("/users")
def search_users(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    blocked_users = db.query(models.Block.blocked_id).filter(
        models.Block.blocker_id == current_user.id
    ).all()


    blocked_by_users = db.query(models.Block.blocker_id).filter(
        models.Block.blocked_id == current_user.id
    ).all()


    blocked_ids = [
        user[0] for user in blocked_users
    ] + [
        user[0] for user in blocked_by_users
    ]


    users = db.query(models.User).filter(
        or_(
            models.User.username.ilike(f"%{q}%"),
            models.User.email.ilike(f"%{q}%")
        ),
        ~models.User.id.in_(blocked_ids)
    ).all()


    return users





# Search Posts
@router.get("/posts")
def search_posts(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    blocked_users = db.query(models.Block.blocked_id).filter(
        models.Block.blocker_id == current_user.id
    ).all()


    blocked_by_users = db.query(models.Block.blocker_id).filter(
        models.Block.blocked_id == current_user.id
    ).all()


    blocked_ids = [
        user[0] for user in blocked_users
    ] + [
        user[0] for user in blocked_by_users
    ]


    posts = db.query(models.Post).filter(
        models.Post.caption.ilike(f"%{q}%"),
        ~models.Post.owner_id.in_(blocked_ids)
    ).all()


    return posts





# Explore Feed
@router.get("/")
def explore_posts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    blocked_users = db.query(models.Block.blocked_id).filter(
        models.Block.blocker_id == current_user.id
    ).all()


    blocked_by_users = db.query(models.Block.blocker_id).filter(
        models.Block.blocked_id == current_user.id
    ).all()


    blocked_ids = [
        user[0] for user in blocked_users
    ] + [
        user[0] for user in blocked_by_users
    ]


    posts = db.query(models.Post).filter(
        ~models.Post.owner_id.in_(blocked_ids)
    ).order_by(
        models.Post.created_at.desc()
    ).offset(skip).limit(limit).all()


    return posts