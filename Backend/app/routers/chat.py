from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Path
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.database import get_db
from app import cloudinary, models, oauth2, schemas


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "/send",
    response_model=schemas.MessageResponse,
    summary="Send a message",
    description="""
Send a text message to another Pixora user.

This endpoint allows an authenticated user to send a direct message to another user.
A notification is created for the receiver after sending the message.

Returns:
- Message information
- Sender details
- Receiver details
- Message content

Requirements:
- User must be authenticated.
- Receiver must exist.
- Users must not block each other.
"""
)
def send_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Check receiver exists
    receiver = db.query(models.User).filter(
        models.User.id == message.receiver_id
    ).first()

    if receiver is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )

    blocked = db.query(models.Block).filter(
        models.Block.blocker_id == message.receiver_id,
        models.Block.blocked_id == current_user.id
    ).first()

    if blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are blocked by this user"
        )

    blocked_by_you = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == message.receiver_id
    ).first()

    if blocked_by_you:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You blocked this user"
        )

    new_message = models.Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        message_type=message.message_type,
        content=message.content,
        file_url=message.file_url,
        file_name=message.file_name,
        file_size=message.file_size
    )

    notification = models.Notification(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        type="message",
        message=f"{current_user.username} sent you a message"
    )

    db.add(new_message)
    db.add(notification)

    db.commit()
    db.refresh(new_message)

    return new_message


@router.get(
    "/{user_id}",
    response_model=list[schemas.MessageResponse],
    summary="Get conversation",
    description="""
Retrieve conversation messages between the authenticated user and another user.

This endpoint returns all messages exchanged between two users.
Received messages are automatically marked as seen.

Returns:
- List of messages
- Message details
- Sender and receiver information

Requirements:
- User must be authenticated.
- A valid user ID is required.
"""
)
def get_conversation(
    user_id: int = Path(
        ...,
        title="User ID",
        description="Unique ID of the user whose conversation you want to retrieve.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    messages = db.query(models.Message).filter(
        or_(
            and_(
                models.Message.sender_id == current_user.id,
                models.Message.receiver_id == user_id
            ),
            and_(
                models.Message.sender_id == user_id,
                models.Message.receiver_id == current_user.id
            )
        )
    ).order_by(
        models.Message.created_at
    ).all()

    for message in messages:
        if message.receiver_id == current_user.id:
            message.is_seen = True

    db.commit()

    return messages


@router.post(
    "/send-file",
    response_model=schemas.MessageResponse,
    summary="Send file message",
    description="""
Send a file message to another Pixora user.

This endpoint allows users to upload and send files including images, videos, and documents.

Returns:
- Message information
- Uploaded file details
- File URL

Requirements:
- User must be authenticated.
- Receiver must exist.
- File upload is required.
- Users must not block each other.

Supported files:
- Images
- Videos
- Documents
"""
)
def send_file_message(
    receiver_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    receiver = db.query(models.User).filter(
        models.User.id == receiver_id
    ).first()

    if receiver is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )

    blocked = db.query(models.Block).filter(
        models.Block.blocker_id == receiver_id,
        models.Block.blocked_id == current_user.id
    ).first()

    if blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are blocked by this user"
        )

    blocked_by_you = db.query(models.Block).filter(
        models.Block.blocker_id == current_user.id,
        models.Block.blocked_id == receiver_id
    ).first()

    if blocked_by_you:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You blocked this user"
        )

    upload_result = cloudinary.upload_file(file.file)

    if file.content_type.startswith("image"):
        message_type = "image"
    elif file.content_type.startswith("video"):
        message_type = "video"
    else:
        message_type = "document"

    new_message = models.Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        message_type=message_type,
        file_url=upload_result["url"],
        file_type=file.content_type,
        file_name=upload_result["name"],
        file_size=upload_result["size"]
    )

    notification = models.Notification(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        type="message",
        message=f"{current_user.username} sent you a file"
    )

    db.add(new_message)
    db.add(notification)

    db.commit()
    db.refresh(new_message)

    return new_message


@router.get(
    "/unread/count",
    summary="Get unread messages count",
    description="""
Retrieve the number of unread messages for the authenticated user.

Returns:
- Total unread messages count

Requirements:
- User must be authenticated.
"""
)
def unread_messages_count(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    count = db.query(models.Message).filter(
        models.Message.receiver_id == current_user.id,
        models.Message.is_seen.is_(False)
    ).count()

    return {
        "unread_messages": count
    }


@router.delete(
    "/message/{message_id}",
    summary="Unsend a message",
    description="""
Remove a sent message from Pixora.

This endpoint allows a user to unsend their own message.
The message content is replaced and attached files are removed.

Returns:
- Success message after unsending.

Requirements:
- User must be authenticated.
- Message must exist.
- User can only unsend their own messages.
"""
)
def unsend_message(
    message_id: int = Path(
        ...,
        title="Message ID",
        description="Unique ID of the message that you want to unsend.",
        examples=[1]
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    message = db.query(models.Message).filter(
        models.Message.id == message_id
    ).first()

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    if message.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only unsend your own messages"
        )

    message.is_deleted = True
    message.content = "This message was unsent"
    message.file_url = None

    db.commit()

    return {
        "message": "Message unsent successfully"
    }