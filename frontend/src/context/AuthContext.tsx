import { createContext, useEffect, useState, type ReactNode, } from "react";
import type { User } from "../utils/type";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (data: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (data: any) => {
    const userData = { name: data.name, email: data.email, role: data.role };
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "Admin", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;