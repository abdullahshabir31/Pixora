from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from fastapi import Path, Query
from app import cloudinary, models, oauth2, schemas, utils
from app.database import get_db
from datetime import date, datetime


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserResponse,
    summary="Create User",
    description="""
Register a new user account on Pixora.

This endpoint creates a new account using the provided user information.

### Requirements
- Unique username
- Unique email address
- Valid password

The password is securely hashed before being stored.
""",
)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_username = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    hashed_password = utils.hash(user.password)

    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        full_name=user.full_name,
        bio=user.bio,
        website=user.website,
        gender=user.gender,
        date_of_birth=user.date_of_birth
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get(
    "/me",
    response_model=schemas.ProfileResponse,
    summary="Get My Profile",
    description="""
Retrieve the profile information of the currently authenticated user.

### Returns
- Personal information
- Profile details
- Followers count
- Following count
- Total posts
- Privacy status

Requires a valid JWT access token.
""",
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    posts_count = db.query(models.Post).filter(
        models.Post.owner_id == current_user.id
    ).count()

    followers_count = db.query(models.Follow).filter(
        models.Follow.following_id == current_user.id
    ).count()

    following_count = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user.id
    ).count()

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_private": current_user.is_private
    }


@router.get(
    "/profile/{user_id}",
    response_model=schemas.ProfileResponse,
    summary="Get User Profile",
    description="""
Retrieve the public profile information of another Pixora user.

### Returns
- User information
- Followers count
- Following count
- Total posts
- Privacy status

Access is denied if either user has blocked the other.
""",
)
def get_user_profile(
    user_id: int = Path(
    ...,
    title="User ID",
    description="Unique ID of the user whose profile you want to retrieve.",
    examples=[1]
),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    blocked = db.query(models.Block).filter(
        models.Block.blocker_id == user_id,
        models.Block.blocked_id == current_user.id
    ).first()

    if blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are blocked by this user"
        )

    blocked_by_you = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == user_id
    ).first()

    if blocked_by_you:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You blocked this user"
        )

    posts_count = db.query(models.Post).filter(
        models.Post.owner_id == user_id
    ).count()

    followers_count = db.query(models.Follow).filter(
        models.Follow.following_id == user_id
    ).count()

    following_count = db.query(models.Follow).filter(
        models.Follow.follower_id == user_id
    ).count()

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_private": user.is_private
    }

@router.get(
    "/search",
    response_model=list[schemas.UserSearchResponse],
    summary="Search Users",
    description="""
Search Pixora users by username.

Supports partial username matching and returns matching user profiles.

Authentication is required.
""",
)
def search_users(
    username: str = Query(
    ...,
    title="Username",
    description="Enter the username or part of a username to search.",
    examples=["abdullah"]
),
    db: Session = Depends(get_db)
):

    if not username.strip():
        return []

    users = db.query(models.User).filter(
        models.User.username.ilike(f"%{username}%")
    ).all()

    return users


@router.put(
    "/me",
    response_model=schemas.UserResponse,
    summary="Update Profile",
    description="""
Update the authenticated user's profile.

You can update:

- Username
- Full Name
- Bio
- Website
- Gender
- Date of Birth
- Privacy Status
- Profile Picture

Profile images are uploaded to Cloudinary.
""",
)
def update_profile(
    username: str | None = Form(
    None,
    description="Update your username.",
    examples=["abdullah31"]
),
    full_name: str | None = Form(
    None,
    description="Update your full name.",
    examples=["Abdullah Shabir"]
),
    bio: str | None = Form(
    None,
    description="Update your profile bio.",
    examples=["Full Stack Web Developer"]
),
    website: str | None = Form(
    None,
    description="Personal or portfolio website.",
    examples=["https://abdullah.dev"]
),
    gender: str | None = Form(
    None,
    description="Gender.",
    examples=["Male"]
),
    date_of_birth: date | None = Form(
    None,
    description="Date of birth.",
    examples=["2003-05-15"]
),
    is_private: bool | None = Form(
    None,
    description="Enable or disable private account."
),
    profile_image: UploadFile | None = File(
    None,
    description="Upload a new profile picture."
),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    if username:
        existing_user = db.query(models.User).filter(
            models.User.username == username,
            models.User.id != current_user.id
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        current_user.username = username

    if full_name is not None:
        current_user.full_name = full_name

    if bio is not None:
        current_user.bio = bio

    if website is not None:
        current_user.website = website

    if gender is not None:
        current_user.gender = gender

    if date_of_birth is not None:
        current_user.date_of_birth = date_of_birth

    if is_private is not None:
        current_user.is_private = is_private

    if profile_image:
        image_url = cloudinary.upload_image(profile_image.file)
        current_user.profile_image = image_url

    db.commit()
    db.refresh(current_user)

    return current_user


@router.put(
    "/change-password",
    summary="Change Password",
    description="""
Change the password of the authenticated user.

The current password must be correct before a new password can be set.

Passwords are securely hashed before being stored.
""",
)
def change_password(
    passwords: schemas.ChangePassword,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):

    if not utils.verify(
        passwords.current_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    current_user.password = utils.hash(
        passwords.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }