from fastapi import FastAPI

from app.config import settings
from app.routers import (
    users,
    auth,
    posts,
    likes,
    comments,
    follows,
    saved_posts,
    stories,
    reels,
    chat,
    notifications,
    explore,
    block
)

app = FastAPI(
    title="Pixora API",
    version="1.0.0",
    description="""
## Welcome to Pixora API

Pixora API powers the Pixora social media platform.

Using this API, you can:

- 👤 Register and manage user accounts
- 🔐 Authenticate users with JWT
- 🖼️ Create and manage posts
- ❤️ Like and unlike posts
- 💬 Comment on posts
- 👥 Follow and unfollow users
- 🔖 Save and unsave posts
- 📸 Share Stories
- 🎬 Upload Reels
- 💬 Send Chat Messages
- 🔔 Manage Notifications
- 🔍 Explore users and posts
- 🚫 Block and unblock users

Each endpoint includes its own documentation, request parameters, and response models.

Built with FastAPI and PostgreSQL.
""",
    contact={
        "name": "Abdullah",
        "url": "https://github.com/abdullahshabir31",
    },
)

# Using Alembic for database migrations

# Routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(follows.router)
app.include_router(saved_posts.router)
app.include_router(stories.router)
app.include_router(reels.router)
app.include_router(chat.router)
app.include_router(notifications.router)
app.include_router(explore.router)
app.include_router(block.router)


@app.get(
    "/",
    summary="API Status",
    description="Returns the current status of the Pixora API and the connected database.",
    response_description="API status information."
)
def root():
    return {
        "message": "Welcome to Pixora API 🚀",
        "database": settings.database_name
    }