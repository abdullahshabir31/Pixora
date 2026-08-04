# 🚀 Pixora

Modern Full-Stack Social Media Platform built with **React.js**, **FastAPI**, **PostgreSQL**, and **Cloudinary**, featuring authentication, posts, likes, comments, stories, reels, chat, and more.

---

# 📖 About

Pixora is a modern full-stack social media platform inspired by today's leading social networking applications. It enables users to create accounts, share posts, interact with others, manage their profiles, and engage through likes, comments, stories, reels, chats, and notifications.

The project is built using a scalable client-server architecture with a React frontend, FastAPI backend, PostgreSQL database, and Cloudinary for media storage.

---

# 🚀 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript (ES6+)
- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- Framer Motion
- Lucide React

## Backend

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic
- JWT Authentication
- Pydantic
- Passlib
- Python-Jose
- Cloudinary

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing
- Protected API Endpoints

---

## 👤 User Profiles

- View User Profiles
- Edit Profile
- Upload Profile Picture
- Bio
- Website
- Gender
- Date of Birth
- Public / Private Account
- Followers & Following
- Follow / Unfollow Users

---

## 📸 Posts

- Create Posts
- Upload Images
- Edit Posts
- Delete Posts
- View Individual Posts
- Home Feed
- Captions

---

## ❤️ Social Features

- Like / Unlike Posts
- Comment System
- Save / Unsave Posts
- Search Users
- Personalized Feed

---

## 📖 Stories

- Create Stories
- View Stories

---

## 🎥 Reels

- Create Reels
- Browse Reels

---

## 💬 Messaging

- One-to-One Chat
- Conversations

---

## 🔔 Notifications

- User Notifications

---

## 🚫 Privacy & Security

- Block / Unblock Users
- JWT Authorization
- Secure Password Hashing
- Input Validation
- Protected Routes

---

# 📂 Project Structure

```text
Pixora-Project/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── Backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/abdullahshabir31/Pixora-Project.git
```

```bash
cd Pixora-Project
```

---

# 💻 Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# ⚡ Backend Setup

```bash
cd Backend

python -m venv venv
```

### Activate Virtual Environment (Windows)

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Backend

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

Pixora uses **PostgreSQL** with **SQLAlchemy ORM** and **Alembic** for efficient database management and schema migrations.

---

# ☁️ Media Storage

Images are uploaded and managed using **Cloudinary**, providing secure and optimized cloud-based media storage.

---

# 🏗 Architecture

```text
                React Frontend
                       │
                       │ REST API (Axios)
                       ▼
                 FastAPI Backend
                       │
             SQLAlchemy ORM + JWT
                       │
                       ▼
              PostgreSQL Database
                       │
                       ▼
                 Cloudinary Storage
```

---

# 📊 Project Highlights

- Full-Stack Social Media Platform
- RESTful API Architecture
- JWT Authentication
- Responsive User Interface
- Cloud Image Upload
- PostgreSQL Database
- Modular Code Structure
- Scalable Backend Design
- Production-Ready Project Structure

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
