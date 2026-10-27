import axios from 'axios';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AnalysisRecord {
  _id: string;
  userId: string | { _id: string; name: string; email: string; role?: string };
  headline: string;
  content: string;
  sourceUrl?: string;
  sourceName?: string;
  prediction: 'Likely Credible' | 'Needs Verification' | 'Potentially Misleading';
  credibilityScore: number;
  confidenceScore: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  sentimentScore: number;
  wordCount: number;
  characterCount: number;
  clickbaitScore: number;
  emotionalLanguageScore: number;
  suspiciousPhraseCount: number;
  capitalizationScore: number;
  punctuationScore: number;
  detectedIndicators: string[];
  keyPhrases: string[];
  explanation: string;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackRecord {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  analysisId: string | { _id: string; headline: string; prediction: string; credibilityScore: number };
  isAccurate: boolean;
  comment?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  credibleCount: number;
  verificationCount: number;
  misleadingCount: number;
  averageScore: number;
  averageConfidence: number;
  recentAnalyses: AnalysisRecord[];
}

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  credibleCount: number;
  verificationCount: number;
  misleadingCount: number;
  totalFeedback: number;
  feedbackAccuracyRate: number;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Don't auto-redirect on login failure, but redirect on stale token
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const authAPI = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) =>
    api.post<{ success: boolean; token: string; user: UserData; message: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; token: string; user: UserData; message: string }>('/auth/login', data),
  getMe: () => api.get<{ success: boolean; user: UserData }>('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// --- Analysis Endpoints ---
export const analysisAPI = {
  create: (data: { headline: string; content: string; sourceUrl?: string }) =>
    api.post<{ success: boolean; message: string; data: AnalysisRecord }>('/analysis', data),
  getById: (id: string) =>
    api.get<{ success: boolean; data: AnalysisRecord; userFeedback: FeedbackRecord | null }>(`/analysis/${id}`),
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/analysis/${id}`),
  getHistory: (params: { page?: number; limit?: number; prediction?: string; search?: string }) =>
    api.get<{
      success: boolean;
      data: AnalysisRecord[];
      pagination: { totalItems: number; totalPages: number; currentPage: number; limit: number };
    }>('/analysis/history', { params }),
};

// --- Dashboard Endpoints ---
export const dashboardAPI = {
  getStats: () => api.get<{ success: boolean; stats: DashboardStats }>('/dashboard/stats'),
};

// --- Feedback Endpoints ---
export const feedbackAPI = {
  submit: (data: { analysisId: string; isAccurate: boolean; comment?: string }) =>
    api.post<{ success: boolean; message: string; data: FeedbackRecord }>('/feedback', data),
  getByAnalysisId: (analysisId: string) =>
    api.get<{ success: boolean; data: FeedbackRecord | null }>(`/feedback/${analysisId}`),
};

// --- User Profile Endpoints ---
export const userAPI = {
  getProfile: () =>
    api.get<{ success: boolean; data: UserData & { totalAnalyses: number } }>('/users/profile'),
  updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string; confirmNewPassword?: string }) =>
    api.put<{ success: boolean; message: string; data: UserData }>('/users/profile', data),
};

// --- Admin Endpoints ---
export const adminAPI = {
  getStats: () => api.get<{ success: boolean; stats: AdminStats }>('/admin/stats'),
  getUsers: () => api.get<{ success: boolean; users: (UserData & { analysesCount: number })[] }>('/admin/users'),
  getAnalyses: (params: { page?: number; limit?: number; prediction?: string; search?: string }) =>
    api.get<{
      success: boolean;
      data: AnalysisRecord[];
      pagination: { totalItems: number; totalPages: number; currentPage: number; limit: number };
    }>('/admin/analyses', { params }),
  getFeedback: () => api.get<{ success: boolean; feedback: FeedbackRecord[] }>('/admin/feedback'),
  deleteAnalysis: (id: string) => api.delete<{ success: boolean; message: string }>(`/admin/analysis/${id}`),
};

export default api;
