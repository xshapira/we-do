Getting Started with the Project
----------------------------------

To run the project, follow these steps:

Rename the .example.env file to .env

```bash
mv .example.env .env
```

Build and run the Docker containers using docker-compose.

```bash
docker-compose up --build
```

Docker will now pull the necessary images, build the backend and frontend containers, and start the application.

**Accessing the Backend**:

Once the containers are up and running, the backend server will be accessible at:

```bash
http://0.0.0.0:8000/
```

**Using the Django Admin**:

To access the Django Admin interface, use the following URL:

```bash
http://0.0.0.0:8000/admin/
```

**Username**: admin

**Password**: admin
