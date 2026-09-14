export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin' | 'moderator';
  plan: 'Free' | 'Premium' | 'VIP';
  createdAt?: string;
}

export interface Session {
  user: SessionUser;
  token: string;
  isAdmin: boolean;
}