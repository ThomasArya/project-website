import type { User } from '../types/user.tsx';
import { mockUsers } from '../data/index.tsx';
import storage from './storage.tsx';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: User['role'];
  plan: User['plan'];
}

export interface AuthResult {
  user?: AuthUser;
  token?: string;
  error?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export interface Session {
  user: AuthUser;
  token: string;
  isAdmin: boolean;
}

const SESSION_KEY = 'auth-session';

const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  plan: user.plan,
});

const fakeDelay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    await fakeDelay();
    const user = mockUsers.find((u) => u.email.toLowerCase() === payload.email.trim().toLowerCase());
    if (!user) return { error: 'Email or password is incorrect. Please try again.' };
    if (payload.remember) {
      storage.set('remembered-email', payload.email);
    } else {
      storage.remove('remembered-email');
    }
    const authUser = toAuthUser(user);
    const token = `fake-token-${user.id}-${Date.now()}`;
    return { user: authUser, token };
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    await fakeDelay();
    const exists = mockUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) return { error: 'An account with that email already exists.' };
    if (payload.password.length < 6) return { error: 'Password must be at least 6 characters.' };
    const authUser: AuthUser = {
      id: `user-${Date.now()}`,
      username: payload.username,
      email: payload.email,
      avatar: `https://picsum.photos/seed/${encodeURIComponent(payload.username)}/200/200`,
      role: 'user',
      plan: 'Free',
    };
    return { user: authUser, token: `fake-token-${authUser.id}-${Date.now()}` };
  },

  async forgotPassword(email: string): Promise<AuthResult> {
    await fakeDelay();
    if (!email.includes('@')) return { error: 'Please enter a valid email address.' };
    return { token: `reset-sent-${Date.now()}` };
  },

  getSession(): Session | null {
    return storage.get<Session | null>(SESSION_KEY, null);
  },

  setSession(session: Session): void {
    storage.set(SESSION_KEY, session);
  },

  async restore(): Promise<User | null> {
    await fakeDelay(150);
    const session = this.getSession();
    return session ? (session.user as unknown as User) : null;
  },

  logout(): void {
    storage.remove(SESSION_KEY);
  },

  remembersEmail(): string {
    return storage.get<string>('remembered-email', '');
  },
};

export default authService;