import { apiFetch } from './api';

export interface AdminDashboard {
  totalStudents: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalWorkHours: number;
}

export interface StudentDashboard {
  myApplications: number;
  myWorkHours: number;
  myFeedback: number;
  availableJobs: number;
}

export const dashboardService = {
  getAdminDashboard: (): Promise<AdminDashboard> =>
    apiFetch('/dashboard/admin'),

  getStudentDashboard: (): Promise<StudentDashboard> =>
    apiFetch('/dashboard/student'),
};
