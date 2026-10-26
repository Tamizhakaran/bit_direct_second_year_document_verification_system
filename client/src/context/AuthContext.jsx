import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, notificationAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load user profile if token exists
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('bit_dny_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      if (res.data.success) {
        setUser(res.data.user);
        fetchNotifications();
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch authenticated user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('bit_dny_token', res.data.token);
      setUser(res.data.user);
      fetchNotifications();
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data.success) {
      localStorage.setItem('bit_dny_token', res.data.token);
      setUser(res.data.user);
      fetchNotifications();
    }
    return res.data;
  };

  const registerStaff = async (formData) => {
    const res = await authAPI.registerStaff(formData);
    if (res.data.success) {
      localStorage.setItem('bit_dny_token', res.data.token);
      setUser(res.data.user);
      fetchNotifications();
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('bit_dny_token');
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const markNotificationRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notifications,
        unreadCount,
        login,
        register,
        registerStaff,
        logout,
        fetchCurrentUser,
        fetchNotifications,
        markNotificationRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
