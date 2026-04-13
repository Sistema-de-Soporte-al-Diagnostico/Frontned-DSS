import { createContext, useMemo, useState } from 'react';
import { login as loginService } from '../services/authService';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'sis_ia_vet_token';
const USER_KEY = 'sis_ia_vet_user';

function readFromStorage(key) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

function writeToStorage(key, value, remember) {
  const primary = remember ? localStorage : sessionStorage;
  const secondary = remember ? sessionStorage : localStorage;

  if (value == null) {
    primary.removeItem(key);
    secondary.removeItem(key);
    return;
  }

  secondary.removeItem(key);
  primary.setItem(key, value);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readFromStorage(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = readFromStorage(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials, options = {}) => {
    const remember = options.remember !== false;

    setLoading(true);
    try {
      const response = await loginService(credentials);
      setToken(response.access_token);
      setUser(response.user);

      writeToStorage(TOKEN_KEY, response.access_token, remember);
      writeToStorage(USER_KEY, JSON.stringify(response.user), remember);

      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      loading,
      login,
      logout,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
