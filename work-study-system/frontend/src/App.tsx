import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobPostings from './pages/admin/JobPostings';
import Applications from './pages/admin/Applications';
import WorkHours from './pages/admin/WorkHours';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseJobs from './pages/student/BrowseJobs';
import MyApplications from './pages/student/MyApplications';
import MyWorkHours from './pages/student/MyWorkHours';
import MyFeedback from './pages/student/MyFeedback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <JobPostings />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Applications />
            </ProtectedRoute>
          } />
          <Route path="/admin/workhours" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <WorkHours />
            </ProtectedRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/jobs" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <BrowseJobs />
            </ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="/student/workhours" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyWorkHours />
            </ProtectedRoute>
          } />
          <Route path="/student/feedback" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyFeedback />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
