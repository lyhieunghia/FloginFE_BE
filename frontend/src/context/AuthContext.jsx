import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch("https://localhost:8080/api/auth/me")
      .then(data => {
        if (data && data.username) {
          setUser(data);
        }
      })
      .catch(() => {});
  }, []);

  // Login
  const login = async (username, password) => {
    const res = await apiFetch("https://localhost:8080/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    if (res.success) {
      // Reload user
      const me = await apiFetch("https://localhost:8080/api/auth/me");
      setUser(me);
    }

    return res;
  };

  // Logout
  const logout = async () => {
    await apiFetch("https://localhost:8080/api/auth/logout", {
      method: "POST"
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
