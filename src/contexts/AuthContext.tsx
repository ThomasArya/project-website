import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, SessionUser } from '../types/context.tsx';
import authService from '../services/auth.service.tsx';

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (user: SessionUser) => void;
  register: (user: SessionUser) => void;
  logout: () => void;
  updateUser: (patch: Partial<SessionUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authService.getSession();
    if (stored) setSession(stored);
    setLoading(false);
  }, []);

  const login = useCallback((user: SessionUser) => {
    const next = { user, token: `ui-session-${Date.now()}`, isAdmin: user.role === 'admin' };
    setSession(next);
    authService.setSession(next);
  }, []);

  const register = useCallback((user: SessionUser) => {
    const next = { user, token: `ui-session-${Date.now()}`, isAdmin: user.role === 'admin' };
    setSession(next);
    authService.setSession(next);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    authService.logout();
  }, []);

  const updateUser = useCallback((patch: Partial<SessionUser>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...patch } };
      authService.setSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isAdmin: session?.isAdmin ?? false,
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [session, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthProvider;