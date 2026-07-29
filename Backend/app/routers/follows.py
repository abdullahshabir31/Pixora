from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, oauth2


router = APIRouter(
    prefix="/users",
    tags=["Follows"]
)


@router.post(
    "/{user_id}/follow",
    status_code=status.HTTP_201_CREATED,
    summary="Follow a user",
    description="""
Follow another user on Pixora.

This endpoint allows an authenticated user to follow another user.
For private accounts, a follow request is created and the user must approve it.
For public accounts, the follow relationship is created immediately.

Returns:
- Follow information for public accounts.
- Follow request message for private accounts.

Requirements:
- User must be authenticated.
- Target user must exist.
- User cannot follow themselves.
- User must not be blocked by the target user.
- User must not have blocked the target user.

Notifications:
- A notification is created when a follow or follow request is sent.
"""
)
def follow_user(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user you want to follow.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Self follow check
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot follow yourself"
        )

    # Check user exists
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if receiver blocked current user
    blocked = db.query(models.Block).filter(
        models.Block.blocker_id == user_id,
        models.Block.blocked_id == current_user.id
    ).first()

    if blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are blocked by this user"
        )

    # Check if current user blocked receiver
    blocked_by_you = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == user_id
    ).first()

    if blocked_by_you:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You blocked this user"
        )

    # Already following check
    existing_follow = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user.id,
        models.Follow.following_id == user_id
    ).first()

    if existing_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this user"
        )

    # Private account
    if user.is_private:
        existing_request = db.query(models.FollowRequest).filter(
            models.FollowRequest.sender_id == current_user.id,
            models.FollowRequest.receiver_id == user_id,
            models.FollowRequest.status == "pending"
        ).first()

        if existing_request:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Follow request already sent"
            )

        follow_request = models.FollowRequest(
            sender_id=current_user.id,
            receiver_id=user_id,
            status="pending"
        )

        notification = models.Notification(
            sender_id=current_user.id,
            receiver_id=user_id,
            type="follow_request",
            message=f"{current_user.username} sent you a follow request"
        )

        db.add(follow_request)
        db.add(notification)
        db.commit()

        return {
            "message": "Follow request sent"
        }

    # Public account
    new_follow = models.Follow(
        follower_id=current_user.id,
        following_id=user_id
    )

    notification = models.Notification(
        sender_id=current_user.id,
        receiver_id=user_id,
        type="follow",
        message=f"{current_user.username} started following you"
    )

    db.add(new_follow)
    db.add(notification)

    db.commit()
    db.refresh(new_follow)

    return new_follow


@router.get(
    "/follow-requests",
    summary="Get follow requests",
    description="""
Retrieve pending follow requests for the authenticated user on Pixora.

This endpoint returns all users who have requested to follow the current user's private account.

Returns:
- List of pending follow requests.

Requirements:
- User must be authenticated.
- Only pending requests are returned.
"""
)
def get_follow_requests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    requests = db.query(models.FollowRequest).filter(
        models.FollowRequest.receiver_id == current_user.id,
        models.FollowRequest.status == "pending"
    ).all()

    return requests


@router.put(
    "/follow-requests/{request_id}/accept",
    summary="Accept follow request",
    description="""
Accept a pending follow request on Pixora.

This endpoint allows an authenticated user to accept a follow request.
After acceptance, a follow relationship is created between both users and a notification is sent.

Returns:
- Success message after accepting the follow request.

Requirements:
- User must be authenticated.
- Follow request must exist.
- Follow request must belong to the current user.
"""
)
def accept_follow_request(
    request_id: int = Path(
        ...,
        title="Follow Request ID",
        description="Unique ID of the follow request that you want to accept.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    request = db.query(models.FollowRequest).filter(
        models.FollowRequest.id == request_id,
        models.FollowRequest.receiver_id == current_user.id
    ).first()

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow request not found"
        )

    new_follow = models.Follow(
        follower_id=request.sender_id,
        following_id=current_user.id
    )

    request.status = "accepted"

    notification = models.Notification(
        sender_id=current_user.id,
        receiver_id=request.sender_id,
        type="follow",
        message=f"{current_user.username} accepted your follow request"
    )

    db.add(new_follow)
    db.add(notification)

    db.commit()

    return {
        "message": "Follow request accepted"
    }


@router.put(
    "/follow-requests/{request_id}/reject",
    summary="Reject follow request",
    description="""
Reject a pending follow request on Pixora.

This endpoint allows an authenticated user to decline a follow request.
The follow request status is updated to rejected.

Returns:
- Success message after rejecting the follow request.

Requirements:
- User must be authenticated.
- Follow request must exist.
- Follow request must belong to the current user.
"""
)
def reject_follow_request(
    request_id: int = Path(
        ...,
        title="Follow Request ID",
        description="Unique ID of the follow request that you want to reject.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    request = db.query(models.FollowRequest).filter(
        models.FollowRequest.id == request_id,
        models.FollowRequest.receiver_id == current_user.id
    ).first()

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow request not found"
        )

    request.status = "rejected"

    db.commit()

    return {
        "message": "Follow request rejected"
    }


@router.delete(
    "/{user_id}/follow",
    summary="Unfollow a user",
    description="""
Remove an existing follow relationship on Pixora.

This endpoint allows an authenticated user to unfollow another user.

Returns:
- Success message after unfollowing the user.

Requirements:
- User must be authenticated.
- Follow relationship must exist.
- User can only remove their own follow relationship.
"""
)
def unfollow_user(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user that you want to unfollow.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    follow = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user.id,
        models.Follow.following_id == user_id
    ).first()

    if follow is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow not found"
        )

    db.delete(follow)
    db.commit()

    return {
        "message": "Unfollowed successfully"
    }


@router.get(
    "/{user_id}/followers",
    summary="Get user followers",
    description="""
Retrieve all followers of a Pixora user.

This endpoint returns the list of users who are following the specified user.

Returns:
- Total followers count
- List of followers

Requirements:
- A valid user ID is required.
"""
)
def get_followers(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user whose followers you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db)
):
    followers = db.query(models.Follow).filter(
        models.Follow.following_id == user_id
    ).all()

    return {
        "total_followers": len(followers),
        "followers": followers
    }


@router.get(
    "/{user_id}/following",
    summary="Get users followed by a user",
    description="""
Retrieve all users followed by a Pixora user.

This endpoint returns the list of users that the specified user is following.

Returns:
- Total following count
- List of followed users

Requirements:
- A valid user ID is required.
"""
)
def get_following(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user whose following list you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db)
):
    following = db.query(models.Follow).filter(
        models.Follow.follower_id == user_id
    ).all()

    return {
        "total_following": len(following),
        "following": following
    }