import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ctm_token");

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("ctm_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loginWithToken = async (token, userFromResponse) => {
    localStorage.setItem("ctm_token", token);

    setUser(
      userFromResponse || (await authService.getMe())
    );
  };

  const signup = async (payload) => {
    // Account create hoga,
    // lekin user automatically login nahi hoga.
    await authService.signup(payload);
  };

  const login = async (payload) => {
    const { token, user } = await authService.login(payload);

    await loginWithToken(token, user);
  };

  const logout = () => {
    localStorage.removeItem("ctm_token");
    setUser(null);

    authService.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        loginWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
