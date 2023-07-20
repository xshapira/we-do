Getting Started with the Project
----------------------------------

To install and run the Project, follow these steps:

**Frontend Installation**:

Navigate to the frontend directory:

```bash
cd frontend
```

Install the necessary packages using pnpm:

```bash
pnpm install
```

Build the project:

```bash
pnpm run build
```

**Environment Setup**:

Rename the .example.env file to .env.

```bash
mv .example.env .env
```

**Backend Installation**:

Navigate to the backend directory:

```bash
cd ../backend
```

Install the necessary Python packages using Poetry:

```bash
poetry install
```

**Database Setup**:

Make migrations and migrate the database:

```bash
python manage.py makemigrations
python manage.py migrate
```

**Run the Server**:

Run the Django server:

```bash
python manage.py runserver
```

At this point, the backend server should be running at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
