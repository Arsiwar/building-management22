import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password }, { withCredentials: true });
      setAccessToken(response.data.accessToken);
      setUser({ email: response.data.email });
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const register = async (first_name, last_name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { first_name, last_name, email, password }, { withCredentials: true });
      setAccessToken(response.data.accessToken);
      setUser({ email: response.data.email, first_name: response.data.first_name, last_name: response.data.last_name });
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/refresh', { withCredentials: true });
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw error.response.data.message;
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};