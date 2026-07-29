from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/explore",
    tags=["Explore"]
)


@router.get(
    "/users",
    response_model=list[schemas.UserSearchResponse],
    summary="Search users",
    description="""
Search Pixora users by username or email.

This endpoint allows authenticated users to discover other users.
Blocked users are automatically excluded from search results.

Returns:
- Matching users
- Public user information

Requirements:
- User must be authenticated.
- Search query is required.
"""
)
def search_users(
    q: str = Query(
        ...,
        title="Search Query",
        description="Username or email keyword to search for users.",
        examples=["abdullah"]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    blocked_users = db.query(models.Block.blocked_id).filter(
        models.Block.blocker_id == current_user.id
    ).all()

    blocked_by_users = db.query(models.Block.blocker_id).filter(
        models.Block.blocked_id == current_user.id
    ).all()

    blocked_ids = (
        [user[0] for user in blocked_users] +
        [user[0] for user in blocked_by_users]
    )

    users = db.query(models.User).filter(
        or_(
            models.User.username.ilike(f"%{q}%"),
            models.User.email.ilike(f"%{q}%")
        ),
        ~models.User.id.in_(blocked_ids)
    ).all()

    return users


@router.get(
    "/posts",
    response_model=list[schemas.PostResponse],
    summary="Search posts",
    description="""
Search Pixora posts by caption.

This endpoint searches posts using caption keywords.
Posts from blocked users are automatically excluded.

Returns:
- Matching posts
- Post owner information
- Likes count
- Comments count

Requirements:
- User must be authenticated.
- Search query is required.
"""
)
def search_posts(
    q: str = Query(
        ...,
        title="Search Query",
        description="Keyword to search inside post captions.",
        examples=["travel"]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    blocked_users = db.query(models.Block.blocked_id).filter(
        models.Block.blocker_id == current_user.id
    ).all()

    blocked_by_users = db.query(models.Block.blocker_id).filter(
        models.Block.blocked_id == current_user.id
    ).all()

    blocked_ids = (
        [user[0] for user in blocked_users] +
        [user[0] for user in blocked_by_users]
    )

    posts = db.query(models.Post).filter(
        models.Post.caption.ilike(f"%{q}%"),
        ~models.Post.owner_id.in_(blocked_ids)
    ).all()

    response = []

    for post in posts:
        response.append({
            "id": post.id,
            "caption": post.caption,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "owner": post.owner,
            "likes_count": len(post.likes),
            "comments_count": len(post.comments)
        })

    return response


@router.get(
    "/",
    response_model=list[schemas.PostResponse],
    summary="Explore posts",
    description="""
Retrieve public posts for the Explore section.

This endpoint returns latest posts from Pixora users.
Posts from blocked users are excluded automatically.

Returns:
- List of explore posts
- Post owner information
- Likes count
- Comments count

Requirements:
- User must be authenticated.

Pagination:
- skip: Number of posts to skip.
- limit: Maximum number of posts to return.
"""
)
def explore_posts(
    skip: int = Query(
        0,
        title="Skip",
        description="Number of posts to skip for pagination.",
        examples=[0]
    ),
    limit: int = Query(
        20,
        title="Limit",
        description="Maximum number of posts to retrieve.",
        examples=[20]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    blocked_users = db.query(models.Block.blocked_id).filter(
        models.Block.blocker_id == current_user.id
    ).all()

    blocked_by_users = db.query(models.Block.blocker_id).filter(
        models.Block.blocked_id == current_user.id
    ).all()

    blocked_ids = (
        [user[0] for user in blocked_users] +
        [user[0] for user in blocked_by_users]
    )

    posts = (
        db.query(models.Post)
        .filter(
            ~models.Post.owner_id.in_(blocked_ids)
        )
        .order_by(models.Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    response = []

    for post in posts:
        response.append({
            "id": post.id,
            "caption": post.caption,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "owner": post.owner,
            "likes_count": len(post.likes),
            "comments_count": len(post.comments)
        })

    return response