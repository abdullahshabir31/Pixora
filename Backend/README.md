# Instagram Clone - Backend

This is the backend of the Instagram Clone full-stack application built with **FastAPI** and **PostgreSQL**.

The backend provides REST APIs for authentication, user management, posts, likes, comments, and other social media features. It follows a clean and scalable architecture using FastAPI, SQLAlchemy, and PostgreSQL.

## 🚀 Tech Stack

- Python
- FastAPI
- Uvicorn
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT Authentication
- Passlib & Bcrypt
- Pydantic
- Python-dotenv

## 📂 Project Structure

```text
Backend/
│
├── app/
│   ├── main.py          # FastAPI application entry point
│   ├── database.py      # Database connection setup
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── oauth2.py        # JWT authentication logic
│   │
│   └── routers/         # API route modules
│
├── venv/
├── requirements.txt
└── .env
```

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone <repository-url>
```

Move into the backend folder:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and add your environment variables:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

Run the development server:

```bash
uvicorn app.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## ✨ Features

Currently under development:

- User registration and login
- JWT authentication
- User profiles
- Create and manage posts
- Like system
- Comment system
- Follow/unfollow system
- Search functionality
- Notifications

## 🔐 Authentication

The backend uses JWT (JSON Web Token) authentication.

Users will be able to:

- Register an account
- Login securely
- Access protected routes
- Manage their profile and content

## 🗄️ Database

PostgreSQL is used as the main database.

SQLAlchemy ORM handles:

- Database models
- Relationships
- Queries
- Data management

## 📌 Status

🚧 Backend is currently under development.

New APIs and features will be added gradually.

## 👨‍💻 Author

**Abdullah Shabir**

## 🔗 Connect With Me

- GitHub: https://github.com/abdullahshabir31
- LinkedIn: https://www.linkedin.com/in/abdullahshabir31
- Portfolio: https://abdullah-shabir-portfolio.vercel.app/
