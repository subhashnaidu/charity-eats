# Database Setup Instructions

Follow these steps to set up the database for the CharityEats project:

## Prerequisites

1. Install Python (version 3.9 or higher).
2. Install PostgreSQL or SQLite (depending on your environment).
3. Install `pip` and `virtualenv` for Python package management.

## Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd CharityEats
   ```

2. **Set Up a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r server/requirements.txt
   ```

4. **Configure the Environment Variables**
   - Copy the `.env` file in the `server` directory and update the `DATABASE_URL` with your database connection string.
   ```bash
   cp server/.env.example server/.env
   ```
   Example for PostgreSQL:
   ```
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/charityeats
   ```

5. **Run Database Migrations**
   - Navigate to the `server` directory.
   ```bash
   cd server
   alembic upgrade head
   ```

6. **Verify the Database**
   - Check if the tables are created in your database using a database client or command-line tool.

7. **Run the Application**
   - Start the backend server.
   ```bash
   uvicorn app.main:app --reload
   ```

8. **Optional: Seed the Database**
   - Add initial data to the database if required. Create a script or use an admin interface.

## Notes

- Ensure the database server is running before running migrations.
- Use `alembic revision --autogenerate -m "message"` to create new migrations if models are updated.

# SQLite Database Setup Instructions

Follow these steps to set up an SQLite database for the CharityEats project:

## Prerequisites

1. Install Python (version 3.9 or higher).
2. Install `pip` and `virtualenv` for Python package management.

## Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd CharityEats
   ```

2. **Set Up a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r server/requirements.txt
   ```

4. **Configure the SQLite Database**
   - The database will be automatically created as `charityeats.db` in the `server/app` directory when the application starts.

5. **Run the Application**
   - Start the backend server.
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Verify the Database**
   - Check if the `charityeats.db` file is created in the `server/app` directory and contains the necessary tables.

7. **Optional: Seed the Database**
   - Add initial data to the database if required. Create a script or use an admin interface.

## Notes

- SQLite is a file-based database and does not require a separate server to run.
- The database schema is defined in `server/models/models.py` using SQLAlchemy ORM.