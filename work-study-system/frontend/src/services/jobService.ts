import { apiFetch } from './api';

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  hourlyRate: number;
  maxHoursPerWeek: number;
  totalPositions: number;
  filledPositions: number;
  applicationDeadline: string;
  status: 'ACTIVE' | 'CLOSED' | 'FILLED';
  postedBy: {
    id: number;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobPostingRequest {
  title: string;
  description: string;
  department: string;
  location: string;
  hourlyRate: number;
  maxHoursPerWeek: number;
  totalPositions: number;
  applicationDeadline: string;
}

export const jobService = {
  getAllJobs: (): Promise<JobPosting[]> =>
    apiFetch('/jobs'),

  getActiveJobs: (): Promise<JobPosting[]> =>
    apiFetch('/jobs/active'),

  getJobById: (id: number): Promise<JobPosting> =>
    apiFetch(`/jobs/${id}`),

  getJobsByDepartment: (department: string): Promise<JobPosting[]> =>
    apiFetch(`/jobs/department/${department}`),

  createJob: (data: JobPostingRequest): Promise<JobPosting> =>
    apiFetch('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateJob: (id: number, data: JobPostingRequest): Promise<JobPosting> =>
    apiFetch(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  closeJob: (id: number): Promise<void> =>
    apiFetch(`/jobs/${id}/close`, {
      method: 'PATCH',
    }),

  deleteJob: (id: number): Promise<void> =>
    apiFetch(`/jobs/${id}`, {
      method: 'DELETE',
    }),
};
