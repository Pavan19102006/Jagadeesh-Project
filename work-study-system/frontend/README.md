# Work-Study System Frontend

React frontend for the Work-Study Program Management System.

## Requirements

- Node.js 20+
- npm or yarn

## Installation

```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── Navbar.tsx   # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/        # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── student/     # Student pages
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── services/        # API service functions
│   ├── api.ts       # Base API configuration
│   ├── authService.ts
│   ├── jobService.ts
│   ├── applicationService.ts
│   ├── workHoursService.ts
│   ├── feedbackService.ts
│   └── dashboardService.ts
├── App.tsx          # Main app component
├── App.css          # App-specific styles
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Environment Variables

The frontend expects the backend API to be running at `http://localhost:8080`. 
To change this, modify the `API_URL` in `src/services/api.ts`.

## Features

- Responsive design with Tailwind CSS
- Modern UI with shadcn/ui components
- JWT-based authentication
- Role-based route protection
- Toast notifications with Sonner
