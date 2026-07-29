from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app import cloudinary, models, oauth2, schemas


router = APIRouter(
    prefix="/stories",
    tags=["Stories"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.StoryResponse,
    summary="Create a story",
    description="""
Create a new story on Pixora.

This endpoint allows an authenticated user to upload an image and create a story.
Stories automatically expire after 24 hours.

Returns:
- Story information
- Uploaded media URL
- Story owner details
- Expiration time

Requirements:
- User must be authenticated.
- Image file is required.
- Image upload must be successful.
"""
)
def create_story(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    image_url = cloudinary.upload_image(image.file)

    new_story = models.Story(
        media_url=image_url,
        owner_id=current_user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
    )

    db.add(new_story)
    db.commit()
    db.refresh(new_story)

    return new_story


@router.get(
    "/",
    response_model=list[schemas.StoryResponse],
    summary="Get active stories",
    description="""
Retrieve all active stories on Pixora.

This endpoint returns stories that have not expired yet.
Stories are automatically removed from visibility after 24 hours.

Returns:
- List of active stories
- Story media information
- Owner information

Requirements:
- No authentication required.
"""
)
def get_stories(
    db: Session = Depends(get_db)
):
    stories = db.query(models.Story).filter(
        models.Story.expires_at > datetime.now(timezone.utc)
    ).all()

    return stories


@router.get(
    "/user/{user_id}",
    response_model=list[schemas.StoryResponse],
    summary="Get user stories",
    description="""
Retrieve active stories of a specific Pixora user.

This endpoint returns all non-expired stories uploaded by the selected user.

Returns:
- List of user's active stories
- Story media information
- Expiration details

Requirements:
- A valid user ID is required.
"""
)
def get_user_stories(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user whose stories you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db)
):
    stories = db.query(models.Story).filter(
        models.Story.owner_id == user_id,
        models.Story.expires_at > datetime.now(timezone.utc)
    ).all()

    return stories


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a story",
    description="""
Delete a story from Pixora.

This endpoint allows an authenticated user to permanently remove their own story.

Returns:
- No content is returned after successful deletion.

Requirements:
- User must be authenticated.
- Story must exist.
- Only the story owner can delete the story.

Access is denied if:
- The story does not exist.
- The authenticated user is not the owner.
"""
)
def delete_story(
    id: int = Path(
        ...,
        title="Story ID",
        description="Unique ID of the story that you want to delete.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    story_query = db.query(models.Story).filter(
        models.Story.id == id
    )

    story = story_query.first()

    if story is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )

    if story.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    story_query.delete(
        synchronize_session=False
    )

    db.commit()