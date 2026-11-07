import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, getToken } from './api';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Page reload ayinappudu token undi aithe user ni malli techukovali
  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api.me().then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  const finish = (res) => { setToken(res.token); setUser(res.user); return res.user; };

  const value = {
    user,
    ready,
    setUser,
    login: async (email, password) => finish(await api.login(email, password)),
    register: async (name, email, password) => finish(await api.register(name, email, password)),
    logout: () => { setToken(null); setUser(null); },
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
