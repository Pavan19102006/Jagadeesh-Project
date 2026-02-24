# Work-Study Program Management System

A full-stack web application for managing student work-study programs. This system helps students find and manage work-study positions while supporting program administration.

## Features

### Admin Features
- Post and manage work-study opportunities
- Review and approve/reject student applications
- Track and approve student work hours
- Provide performance feedback to students
- Dashboard with key metrics

### Student Features
- Browse available work-study positions
- Submit applications with cover letters
- Track application status
- Log work hours
- View performance feedback

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- H2 Database (for development)
- Maven

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router DOM

## Project Structure

```
work-study-system/
├── backend/           # Spring Boot backend
│   ├── src/main/java/com/workstudy/
│   │   ├── config/    # Configuration classes
│   │   ├── controller/# REST controllers
│   │   ├── dto/       # Data transfer objects
│   │   ├── entity/    # JPA entities
│   │   ├── repository/# JPA repositories
│   │   ├── security/  # Security configuration
│   │   └── service/   # Business logic
│   └── pom.xml        # Maven dependencies
│
└── frontend/          # React frontend
    ├── src/
    │   ├── components/# React components
    │   ├── contexts/  # React contexts
    │   ├── pages/     # Page components
    │   ├── services/  # API services
    │   └── ...
    └── package.json
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 20 or higher
- Maven

### Running the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### Demo Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Student**: username: `student`, password: `student123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register/student` - Register as student
- `POST /api/auth/register/admin` - Register as admin
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/active` - Get active jobs
- `POST /api/jobs` - Create job (Admin)
- `PUT /api/jobs/{id}` - Update job (Admin)
- `PATCH /api/jobs/{id}/close` - Close job (Admin)
- `DELETE /api/jobs/{id}` - Delete job (Admin)

### Applications
- `GET /api/applications` - Get all applications (Admin)
- `GET /api/applications/my` - Get my applications (Student)
- `POST /api/applications` - Submit application (Student)
- `PATCH /api/applications/{id}/status` - Update status (Admin)
- `PATCH /api/applications/{id}/withdraw` - Withdraw application (Student)

### Work Hours
- `GET /api/workhours` - Get all work hours (Admin)
- `GET /api/workhours/my` - Get my work hours (Student)
- `POST /api/workhours` - Log work hours (Student)
- `PATCH /api/workhours/{id}/status` - Update status (Admin)

### Feedback
- `GET /api/feedback` - Get all feedback (Admin)
- `GET /api/feedback/my` - Get my feedback (Student)
- `POST /api/feedback` - Create feedback (Admin)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard stats
- `GET /api/dashboard/student` - Student dashboard stats

## License

This project is for educational purposes.
