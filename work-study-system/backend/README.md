# Work-Study System Backend

Spring Boot backend for the Work-Study Program Management System.

## Requirements

- Java 17+
- Maven 3.6+

## Running the Application

### Development Mode

```bash
mvn spring-boot:run
```

### Build and Run JAR

```bash
mvn clean package
java -jar target/work-study-system-1.0.0.jar
```

## Configuration

The application uses the following configuration (in `src/main/resources/application.properties`):

- Server port: 8080
- Database: H2 in-memory (for development)
- JWT secret: Can be configured via `jwt.secret` property

## H2 Console

Access the H2 database console at: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:workstudydb`
- Username: `sa`
- Password: (empty)

## Default Users

The application creates two default users on startup:

1. **Admin User**
   - Username: `admin`
   - Password: `admin123`
   - Role: ADMIN

2. **Student User**
   - Username: `student`
   - Password: `student123`
   - Role: STUDENT

## API Documentation

All API endpoints are prefixed with `/api`.

### Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Role-Based Access

- `ADMIN` role: Full access to all endpoints
- `STUDENT` role: Limited access to student-specific endpoints
