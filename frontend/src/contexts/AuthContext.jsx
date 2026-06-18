import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/authService";
import axiosClient from "../services/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );
  const [loading, setLoading] = useState(true);

  const updateAuthorizationHeader = (token) => {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("accessToken", token);
    } else {
      delete axiosClient.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        updateAuthorizationHeader(token);
        const meResponse = await authApi.getMe();
        setUser(meResponse.data.data);
      }
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      updateAuthorizationHeader(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const { user: userData, accessToken: token } = response.data.data;
    setUser(userData);
    setAccessToken(token);
    updateAuthorizationHeader(token);
    return response;
  };

  const register = async (data) => {
    const response = await authApi.register(data);
    const { user: userData, accessToken: token } = response.data.data;
    setUser(userData);
    setAccessToken(token);
    updateAuthorizationHeader(token);
    return response;
  };

  const logout = async () => {
    // Nếu có lỗi ở authApi.logout() thì bạn có thể bỏ dòng await này đi
    await authApi.logout(); 
    setUser(null);
    setAccessToken(null);
    updateAuthorizationHeader(null);
  };

  // 🔴 ĐÂY LÀ HÀM MỚI BỔ SUNG ĐỂ TRỊ BỆNH KHÔNG LƯU STATE
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      // 🔴 BỔ SUNG updateUser VÀO DANH SÁCH VALUE
      value={{ user, accessToken, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);