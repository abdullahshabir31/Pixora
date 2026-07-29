from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/users/me",
    tags=["Saved Posts"]
)


@router.get(
    "/saved-posts",
    response_model=list[schemas.SavedPostItem],
    summary="Get saved posts",
    description="""
Retrieve all posts saved by the authenticated user on Pixora.

This endpoint returns the list of posts that the current user has saved for later viewing.

Returns:
- List of saved posts
- Post information
- Related post details

Requirements:
- User must be authenticated.
- Only the current user's saved posts are returned.
"""
)
def get_saved_posts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    saved_posts = (
        db.query(models.SavedPost)
        .options(joinedload(models.SavedPost.post))
        .filter(models.SavedPost.user_id == current_user.id)
        .all()
    )

    return [saved.post for saved in saved_posts]


@router.post(
    "/saved-posts/{post_id}",
    response_model=schemas.SavedPostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save a post",
    description="""
Save a post on Pixora.

This endpoint allows an authenticated user to save a post for later access.

Returns:
- Saved post information

Requirements:
- User must be authenticated.
- Post must exist.
- The same post cannot be saved multiple times by the same user.
"""
)
def save_post(
    post_id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post that you want to save.",
        examples=[1]
    ),
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

    # Already saved?
    saved_post = db.query(models.SavedPost).filter(
        models.SavedPost.user_id == current_user.id,
        models.SavedPost.post_id == post_id
    ).first()

    if saved_post:
        raise HTTPException(
            status_code=400,
            detail="Post already saved"
        )

    new_saved_post = models.SavedPost(
        user_id=current_user.id,
        post_id=post_id
    )

    db.add(new_saved_post)
    db.commit()
    db.refresh(new_saved_post)

    return new_saved_post


@router.delete(
    "/saved-posts/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove saved post",
    description="""
Remove a saved post from Pixora.

This endpoint allows an authenticated user to remove a post from their saved posts list.

Returns:
- No content is returned after successful removal.

Requirements:
- User must be authenticated.
- Saved post must exist.
"""
)
def unsave_post(
    post_id: int = Path(
        ...,
        title="Post ID",
        description="Unique ID of the post that you want to remove from saved posts.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    saved_post = db.query(models.SavedPost).filter(
        models.SavedPost.user_id == current_user.id,
        models.SavedPost.post_id == post_id
    ).first()

    if not saved_post:
        raise HTTPException(
            status_code=404,
            detail="Saved post not found"
        )

    db.delete(saved_post)
    db.commit()

    return