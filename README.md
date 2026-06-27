# Student Management System

A complete Student Management System with a professional Admin Dashboard UI using FastAPI (Python), SQLite, SQLAlchemy ORM, Pydantic, HTML, CSS, JavaScript, and Jinja2.

## Project Structure
- `main.py`: FastAPI application setup and API routes.
- `database.py`: SQLAlchemy database connection.
- `models.py`: Database tables/models.
- `schemas.py`: Pydantic validation models.
- `crud.py`: Database CRUD operations.
- `templates/`: HTML Jinja2 templates.
- `static/`: CSS and JavaScript files.

## Installation

1. Clone or download this project.
2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## How to start server

Run the following command to start the FastAPI server:
```bash
uvicorn main:app --reload
```

## How to open application

Open your web browser and navigate to:
```
http://127.0.0.1:8000
```

## API Endpoints

- `GET /`: Returns the frontend HTML page.
- `GET /students`: Get all students.
- `POST /students`: Create a new student.
- `GET /students/{id}`: Get a student by ID.
- `PUT /students/{id}`: Update an existing student.
- `DELETE /students/{id}`: Delete a student by ID.
