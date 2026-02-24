import { apiFetch } from './api';

export interface Application {
  id: number;
  student: {
    id: number;
    fullName: string;
    email: string;
    department?: string;
  };
  job: {
    id: number;
    title: string;
    department: string;
  };
  coverLetter: string;
  resumeUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  adminNotes?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    id: number;
    fullName: string;
  };
}

export interface ApplicationRequest {
  jobId: number;
  coverLetter: string;
  resumeUrl?: string;
}

export interface ApplicationStatusRequest {
  status: string;
  adminNotes?: string;
}

export const applicationService = {
  getAllApplications: (): Promise<Application[]> =>
    apiFetch('/applications'),

  getMyApplications: (): Promise<Application[]> =>
    apiFetch('/applications/my'),

  getApplicationsByJob: (jobId: number): Promise<Application[]> =>
    apiFetch(`/applications/job/${jobId}`),

  getApplicationsByStatus: (status: string): Promise<Application[]> =>
    apiFetch(`/applications/status/${status}`),

  getApplicationById: (id: number): Promise<Application> =>
    apiFetch(`/applications/${id}`),

  submitApplication: (data: ApplicationRequest): Promise<Application> =>
    apiFetch('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateApplicationStatus: (id: number, data: ApplicationStatusRequest): Promise<Application> =>
    apiFetch(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  withdrawApplication: (id: number): Promise<void> =>
    apiFetch(`/applications/${id}/withdraw`, {
      method: 'PATCH',
    }),
};
