from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Form, Query, Path
from sqlalchemy.orm import Session, joinedload

from app import cloudinary, models, oauth2, schemas
from app.database import get_db


router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PostResponse,
    summary="Create a new post",
    description="""
Create a new post on Pixora.

This endpoint allows an authenticated user to create a new post by uploading an image and adding a caption.

Returns:
- Post information
- Uploaded image URL
- Owner information
- Post creation timestamp
- Likes and comments count

Requirements:
- User must be authenticated.
- Image file is required.
- Image upload must complete successfully.

The uploaded image is stored using Cloudinary, and the post details are saved in the database.
Access is only available to authenticated users.
"""
)
def create_post(
    caption: str = Form(
        ...,
        title="Post Caption",
        description="Caption text that will be added to the post.",
        examples=["My first post on Pixora"]
    ),
    image: UploadFile = File(
        ...,
        description="Image file that will be uploaded and attached to the post."
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    image_url = cloudinary.upload_image(image.file)

    if not image_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image upload failed"
        )

    new_post = models.Post(
        caption=caption,
        image_url=image_url,
        owner_id=current_user.id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    new_post = (
        db.query(models.Post)
        .options(joinedload(models.Post.owner))
        .filter(models.Post.id == new_post.id)
        .first()
    )

    return {
        "id": new_post.id,
        "caption": new_post.caption,
        "image_url": new_post.image_url,
        "created_at": new_post.created_at,
        "owner": new_post.owner,
        "likes_count": 0,
        "comments_count": 0
    }


@router.get(
    "/",
    response_model=list[schemas.PostResponse],
    summary="Get all posts",
    description="""
Retrieve all available posts on Pixora.

This endpoint fetches posts from the platform while respecting user privacy and blocking restrictions.

Returns:
- Post information
- Post owner's details
- Uploaded image URL
- Creation timestamp
- Total likes count
- Total comments count

Requirements:
- User must be authenticated.
- Blocked users' posts will not be visible.
- Users who have blocked the current user will also be excluded.

Pagination:
- Skip and limit parameters can be used to control the number of posts returned.
"""
)
def get_posts(
    skip: int = Query(
        0,
        title="Skip",
        description="Number of posts to skip before returning results.",
        examples=[0]
    ),
    limit: int = Query(
        10,
        title="Limit",
        description="Maximum number of posts to return in a single request.",
        examples=[10]
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
        .options(joinedload(models.Post.owner))
        .filter(~models.Post.owner_id.in_(blocked_ids))
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
            "comments_count": db.query(models.Comment).filter(
                models.Comment.post_id == post.id
            ).count()
        })

    return response

@router.get(
    "/feed",
    response_model=list[schemas.FeedResponse],
    summary="Get personalized feed",
    description="""
Retrieve personalized posts feed for the authenticated user on Pixora.

This endpoint returns posts from users that the current user follows, along with the user's own posts.
The feed is filtered according to follow relationships and privacy restrictions.

Returns:
- Post information
- Post owner's details
- Uploaded image URL
- Creation timestamp
- Total likes count
- Total comments count

Requirements:
- User must be authenticated.
- Only followed users' posts are included.
- Current user's own posts are included in the feed.
- Posts from blocked users or users who blocked the current user are excluded.

Pagination:
- Skip and limit parameters can be used to control the number of posts returned.
"""
)
def get_feed(
    skip: int = Query(
        0,
        title="Skip",
        description="Number of posts to skip before returning feed results.",
        examples=[0]
    ),
    limit: int = Query(
        10,
        title="Limit",
        description="Maximum number of posts to return in a single feed request.",
        examples=[10]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    following_users = db.query(models.Follow.following_id).filter(
        models.Follow.follower_id == current_user.id
    ).all()

    following_ids = [user[0] for user in following_users]
    following_ids.append(current_user.id)

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
        .options(joinedload(models.Post.owner))
        .filter(
            models.Post.owner_id.in_(following_ids),
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
            "comments_count": db.query(models.Comment).filter(
                models.Comment.post_id == post.id
            ).count()
        })

    return response


@router.get(
    "/{id}",
    response_model=schemas.PostResponse,
    summary="Get post by ID",
    description="""
Retrieve a single post from Pixora using its unique identifier.

This endpoint fetches complete details of a specific post, including owner information and engagement statistics.

Returns:
- Post information
- Post owner's details
- Uploaded image URL
- Creation timestamp
- Total likes count
- Total comments count

Requirements:
- A valid post ID is required.
- The post must exist in the database.

Access is denied if the requested post does not exist.
"""
)
def get_post(
    id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post whose details you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db)
):

    post = (
        db.query(models.Post)
        .options(joinedload(models.Post.owner))
        .filter(models.Post.id == id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    return {
        "id": post.id,
        "caption": post.caption,
        "image_url": post.image_url,
        "created_at": post.created_at,
        "owner": post.owner,
        "likes_count": len(post.likes),
        "comments_count": db.query(models.Comment).filter(
            models.Comment.post_id == post.id
        ).count()
    }


@router.put(
    "/{id}",
    response_model=schemas.PostResponse,
    summary="Update an existing post",
    description="""
Update a post on Pixora.

This endpoint allows an authenticated user to update the details of their existing post.

Returns:
- Updated post information
- Post owner's details
- Updated caption
- Image URL
- Creation timestamp
- Total likes count
- Total comments count

Requirements:
- User must be authenticated.
- A valid post ID is required.
- Only the post owner can update the post.

Access is denied if:
- The post does not exist.
- The authenticated user is not the owner of the post.
"""
)
def update_post(
    updated_post: schemas.PostCreate,
    id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post that you want to update.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    post_query = db.query(models.Post).filter(
        models.Post.id == id
    )

    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this post"
        )

    post_query.update(
        updated_post.model_dump(),
        synchronize_session=False
    )

    db.commit()

    updated = (
        db.query(models.Post)
        .options(joinedload(models.Post.owner))
        .filter(models.Post.id == id)
        .first()
    )

    return {
        "id": updated.id,
        "caption": updated.caption,
        "image_url": updated.image_url,
        "created_at": updated.created_at,
        "owner": updated.owner,
        "likes_count": len(updated.likes),
        "comments_count": db.query(models.Comment).filter(
            models.Comment.post_id == updated.id
        ).count()
    }


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a post",
    description="""
Delete an existing post from Pixora.

This endpoint allows an authenticated user to permanently remove their own post from the platform.

Returns:
- No content is returned after successful deletion.

Requirements:
- User must be authenticated.
- A valid post ID is required.
- Only the post owner can delete the post.

Access is denied if:
- The post does not exist.
- The authenticated user is not the owner of the post.
"""
)
def delete_post(
    id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post that you want to delete.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    post_query = db.query(models.Post).filter(
        models.Post.id == id
    )

    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this post"
        )

    post_query.delete(synchronize_session=False)
    db.commit()

    return