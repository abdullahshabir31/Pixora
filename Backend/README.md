# 🚀 Pixora Backend

The backend of **Pixora**, a modern full-stack social media platform built with **FastAPI**, **PostgreSQL**, and **Cloudinary**.

It provides secure, scalable, and production-ready REST APIs for authentication, user management, posts, likes, comments, follows, saved posts, stories, reels, chat, notifications, and other social media features.

---

# 🚀 Tech Stack

- Python
- FastAPI
- Uvicorn
- PostgreSQL
- SQLAlchemy ORM
- Alembic
- JWT Authentication
- Pydantic
- Passlib
- Python-Jose
- Cloudinary
- Python-dotenv

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing
- Protected API Endpoints

---

## 👤 User Management

- User Profiles
- Edit Profile
- Profile Picture
- Bio
- Website
- Gender
- Date of Birth
- Public / Private Accounts
- Follow / Unfollow Users
- Followers & Following

---

## 📸 Posts

- Create Posts
- Upload Images (Cloudinary)
- Edit Posts
- Delete Posts
- Home Feed
- Individual Post API

---

## ❤️ Social Features

- Like / Unlike Posts
- Comment System
- Save / Unsave Posts
- User Search

---

## 📖 Stories

- Create Stories
- View Stories

---

## 🎥 Reels

- Create Reels
- Browse Reels

---

## 💬 Chat

- One-to-One Messaging

---

## 🔔 Notifications

- Notification APIs

---

## 🚫 Privacy & Security

- Block / Unblock Users
- JWT Authorization
- Secure Password Hashing
- Input Validation

---

# 📂 Project Structure

```text
Backend/
│
├── app/
│   ├── routers/
│   ├── cloudinary.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── oauth2.py
│   ├── schemas.py
│   └── utils.py
│
├── alembic/
├── requirements.txt
├── .env
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/abdullahshabir31/Pixora-Project.git
```

```bash
cd Pixora-Project/Backend
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Run Development Server

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

Swagger UI

```text
http://127.0.0.1:8000/docs
```

ReDoc

```text
http://127.0.0.1:8000/redoc
```

---

# 🗄 Database

Pixora Backend uses **PostgreSQL** with **SQLAlchemy ORM** and **Alembic** to provide a scalable and maintainable database architecture.

---

# ☁️ Media Storage

Images are securely uploaded and managed using **Cloudinary**.

---

# 🏗 Backend Architecture

```text
Client
   │
   ▼
FastAPI REST API
   │
JWT Authentication
   │
SQLAlchemy ORM
   │
PostgreSQL Database
   │
Cloudinary
```

---

# 📊 Backend Highlights

- RESTful API Design
- JWT Authentication
- PostgreSQL Database
- SQLAlchemy ORM
- Alembic Migrations
- Cloudinary Integration
- Modular Architecture
- Scalable Codebase
- Production-Ready Structure

---

# 👨‍💻 Author

## Abdullah Shabir

### Connect With Me

- **GitHub:** https://github.com/abdullahshabir31
- **LinkedIn:** https://www.linkedin.com/in/abdullahshabir31/
- **Portfolio:** https://abdullah-shabir-portfolio.vercel.app/

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
