# 📸 Instagram Clone - Full Stack Application

A full-stack Instagram-inspired social media application built with **React.js**, **FastAPI**, and **PostgreSQL**.

This project aims to recreate core Instagram features including user authentication, profiles, posts, likes, comments, and social interactions while following a modern full-stack architecture.

---

## 🚀 Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- React Router DOM
- Axios
- Tailwind CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic
- Alembic

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing
- Protected Routes

### 👤 User Profile

- View Profile
- Edit Profile
- Profile Picture
- User Information

### 📝 Posts

- Create Posts
- Upload Images
- Add Captions
- Delete Posts
- View Feed

### ❤️ Social Features

- Like / Unlike Posts
- Comments
- Follow / Unfollow Users
- User Search

### 🔔 Additional Features (Coming Soon)

- Notifications
- Direct Messaging
- Explore Page
- Real-time Chat

---

## 📂 Project Structure

```text
Instagram-Clone
│
├── Frontend
│   ├── React Application
│   └── User Interface
│
├── Backend
│   ├── FastAPI Application
│   ├── REST APIs
│   └── Database Management
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone <repository-url>
```

Move into project folder:

```bash
cd Instagram-Clone
```

---

## Frontend Setup

Go to frontend folder:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Backend Setup

Go to backend folder:

```bash
cd Backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI server:

```bash
uvicorn app.main:app --reload
```

API Documentation:

```
http://127.0.0.1:8000/docs
```

---

## 🗄️ Database

This project uses **PostgreSQL** as the primary database.

Database handling:

- SQLAlchemy ORM
- Database Models
- Relationships
- Queries

---

## 🔗 Application Architecture

```
React Frontend
       |
       | HTTP Requests (Axios)
       |
FastAPI Backend
       |
       |
PostgreSQL Database
```

---

## 📌 Project Status

🚧 Currently under development.

New features and improvements will be added gradually.

---

## 👨‍💻 Author

**Abdullah Shabir**

## 🔗 Connect With Me

- GitHub: https://github.com/abdullahshabir31
- LinkedIn: https://www.linkedin.com/in/abdullahshabir31
- Portfolio: https://abdullah-shabir-portfolio.vercel.app/
