from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status, Path
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app import cloudinary, models, oauth2, schemas


router = APIRouter(
    prefix="/reels",
    tags=["Reels"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.ReelResponse,
    summary="Create a reel",
    description="""
Create a new reel on Pixora.

This endpoint allows an authenticated user to upload a video and create a reel.
Users can optionally add a caption with their uploaded video.

Returns:
- Reel information
- Video URL
- Caption
- Reel owner details
- Creation timestamp

Requirements:
- User must be authenticated.
- Video file is required.
- Video upload must be successful.
"""
)
def create_reel(
    caption: str | None = Form(None),
    video: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    video_url = cloudinary.upload_video(video.file)

    new_reel = models.Reel(
        video_url=video_url,
        caption=caption,
        owner_id=current_user.id
    )

    db.add(new_reel)
    db.commit()
    db.refresh(new_reel)

    new_reel = (
        db.query(models.Reel)
        .options(joinedload(models.Reel.owner))
        .filter(models.Reel.id == new_reel.id)
        .first()
    )

    return new_reel


@router.get(
    "/",
    response_model=list[schemas.ReelResponse],
    summary="Get all reels",
    description="""
Retrieve all reels available on Pixora.

This endpoint returns all reels sorted by latest created reels first.

Returns:
- List of reels
- Reel owner information
- Video URLs
- Captions

Requirements:
- No authentication required.
"""
)
def get_reels(
    db: Session = Depends(get_db)
):
    reels = (
        db.query(models.Reel)
        .options(joinedload(models.Reel.owner))
        .order_by(models.Reel.created_at.desc())
        .all()
    )

    return reels


@router.get(
    "/user/{user_id}",
    response_model=list[schemas.ReelResponse],
    summary="Get user reels",
    description="""
Retrieve all reels created by a specific Pixora user.

This endpoint returns reels uploaded by the selected user.

Returns:
- List of user's reels
- Reel owner information
- Video details
- Captions

Requirements:
- A valid user ID is required.
"""
)
def get_user_reels(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user whose reels you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db)
):
    reels = (
        db.query(models.Reel)
        .options(joinedload(models.Reel.owner))
        .filter(models.Reel.owner_id == user_id)
        .order_by(models.Reel.created_at.desc())
        .all()
    )

    return reels


@router.delete(
    "/{id}",
    summary="Delete a reel",
    description="""
Delete a reel from Pixora.

This endpoint allows an authenticated user to permanently remove their own reel.

Returns:
- Success message after deleting the reel.

Requirements:
- User must be authenticated.
- Reel must exist.
- Only the reel owner can delete the reel.

Access is denied if:
- The reel does not exist.
- The authenticated user is not the owner.
"""
)
def delete_reel(
    id: int = Path(
        ...,
        title="Reel ID",
        description="Unique ID of the reel that you want to delete.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    reel = db.query(models.Reel).filter(
        models.Reel.id == id
    ).first()

    if reel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reel not found"
        )

    if reel.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    db.delete(reel)
    db.commit()

    return {
        "message": "Reel deleted successfully"
    }