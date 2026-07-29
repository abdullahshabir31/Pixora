from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, oauth2


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get(
    "/",
    response_model=list[schemas.NotificationResponse],
    summary="Get notifications",
    description="""
Retrieve all notifications for the authenticated user on Pixora.

This endpoint returns all notifications received by the current user,
sorted from newest to oldest.

Returns:
- List of notifications
- Notification details
- Sender information
- Notification type and message

Requirements:
- User must be authenticated.
"""
)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    notifications = db.query(models.Notification).filter(
        models.Notification.receiver_id == current_user.id
    ).order_by(
        models.Notification.created_at.desc()
    ).all()

    return notifications


@router.get(
    "/unread/count",
    summary="Get unread notifications count",
    description="""
Retrieve the total number of unread notifications for the authenticated user.

Returns:
- Total unread notifications count

Requirements:
- User must be authenticated.
"""
)
def unread_notifications_count(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    count = db.query(models.Notification).filter(
        models.Notification.receiver_id == current_user.id,
        models.Notification.is_read.is_(False)
    ).count()

    return {
        "unread_notifications": count
    }


@router.put(
    "/read/{notification_id}",
    summary="Mark notification as read",
    description="""
Mark a specific notification as read on Pixora.

This endpoint updates the notification status from unread to read.

Returns:
- Success message after updating notification status.

Requirements:
- User must be authenticated.
- Notification must exist.
- Notification must belong to the current user.
"""
)
def mark_as_read(
    notification_id: int = Path(
        ...,
        title="Notification ID",
        description="Unique ID of the notification that you want to mark as read.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.receiver_id == current_user.id
    ).first()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    return {
        "message": "Notification marked as read"
    }


@router.put(
    "/read-all",
    summary="Mark all notifications as read",
    description="""
Mark all unread notifications as read for the authenticated user.

This endpoint updates all unread notifications of the current user.

Returns:
- Success message after updating notifications.

Requirements:
- User must be authenticated.
"""
)
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    db.query(models.Notification).filter(
        models.Notification.receiver_id == current_user.id,
        models.Notification.is_read.is_(False)
    ).update(
        {
            "is_read": True
        },
        synchronize_session=False
    )

    db.commit()

    return {
        "message": "All notifications marked as read"
    }