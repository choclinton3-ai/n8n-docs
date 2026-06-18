import api from './client'

export interface LoginPayload { email: string; password: string; rememberMe?: boolean }
export interface RegisterPayload { email: string; firstName: string; lastName: string; password: string; phone?: string }
export interface AuthResponse { user: any; accessToken: string; refreshToken: string }

export const authApi = {
  login: (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data),
  logout: (token: string, refreshToken?: string) => api.post('/auth/logout', { refreshToken }, token),
  refresh: (refreshToken: string) => api.post<AuthResponse>('/auth/refresh', { refreshToken }),
  getMe: (token: string) => api.get<any>('/auth/me', token),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  changePassword: (currentPassword: string, newPassword: string, token: string) =>
    api.patch('/auth/change-password', { currentPassword, newPassword }, token),
}
