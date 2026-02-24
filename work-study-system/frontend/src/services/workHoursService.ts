import { apiFetch } from './api';

export interface WorkHours {
  id: number;
  student: {
    id: number;
    fullName: string;
  };
  job: {
    id: number;
    title: string;
  };
  workDate: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  supervisorNotes?: string;
  approvedBy?: {
    id: number;
    fullName: string;
  };
  approvedAt?: string;
  createdAt: string;
}

export interface WorkHoursRequest {
  jobId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface WorkHoursStatusRequest {
  status: string;
  supervisorNotes?: string;
}

export const workHoursService = {
  getAllWorkHours: (): Promise<WorkHours[]> =>
    apiFetch('/workhours'),

  getMyWorkHours: (): Promise<WorkHours[]> =>
    apiFetch('/workhours/my'),

  getWorkHoursByStudent: (studentId: number): Promise<WorkHours[]> =>
    apiFetch(`/workhours/student/${studentId}`),

  getWorkHoursByJob: (jobId: number): Promise<WorkHours[]> =>
    apiFetch(`/workhours/job/${jobId}`),

  getMyTotalHours: (): Promise<number> =>
    apiFetch('/workhours/my/total'),

  getStudentTotalHours: (studentId: number): Promise<number> =>
    apiFetch(`/workhours/student/${studentId}/total`),

  logWorkHours: (data: WorkHoursRequest): Promise<WorkHours> =>
    apiFetch('/workhours', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateWorkHoursStatus: (id: number, data: WorkHoursStatusRequest): Promise<WorkHours> =>
    apiFetch(`/workhours/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateWorkHours: (id: number, data: WorkHoursRequest): Promise<WorkHours> =>
    apiFetch(`/workhours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteWorkHours: (id: number): Promise<void> =>
    apiFetch(`/workhours/${id}`, {
      method: 'DELETE',
    }),
};
