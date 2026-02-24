import { apiFetch } from './api';

export interface Feedback {
  id: number;
  student: {
    id: number;
    fullName: string;
  };
  job: {
    id: number;
    title: string;
  };
  givenBy: {
    id: number;
    fullName: string;
  };
  rating: number;
  comments: string;
  performanceAreas?: string;
  createdAt: string;
}

export interface FeedbackRequest {
  studentId: number;
  jobId: number;
  rating: number;
  comments: string;
  performanceAreas?: string;
}

export const feedbackService = {
  getAllFeedback: (): Promise<Feedback[]> =>
    apiFetch('/feedback'),

  getMyFeedback: (): Promise<Feedback[]> =>
    apiFetch('/feedback/my'),

  getFeedbackByStudent: (studentId: number): Promise<Feedback[]> =>
    apiFetch(`/feedback/student/${studentId}`),

  getFeedbackByJob: (jobId: number): Promise<Feedback[]> =>
    apiFetch(`/feedback/job/${jobId}`),

  getFeedbackById: (id: number): Promise<Feedback> =>
    apiFetch(`/feedback/${id}`),

  createFeedback: (data: FeedbackRequest): Promise<Feedback> =>
    apiFetch('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteFeedback: (id: number): Promise<void> =>
    apiFetch(`/feedback/${id}`, {
      method: 'DELETE',
    }),
};
