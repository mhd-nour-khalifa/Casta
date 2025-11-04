import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'talent' or 'company'
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@casta_user');
      const type = await AsyncStorage.getItem('@casta_user_type');

      if (userData && type) {
        setUser(JSON.parse(userData));
        setUserType(type);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, type) => {
    try {
      await AsyncStorage.setItem('@casta_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@casta_user_type', type);
      setUser(userData);
      setUserType(type);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@casta_user');
      await AsyncStorage.removeItem('@casta_user_type');
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      await AsyncStorage.setItem('@casta_user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { success: false, error: error.message };
    }
  };

  // Simulate OTP verification
  const verifyOTP = async (phone, otp) => {
    // In a real app, this would call an API
    // For now, accept any 4-digit code
    if (otp && otp.length === 4) {
      return { success: true, phone };
    }
    return { success: false, error: 'Invalid OTP' };
  };

  // Complete registration
  const completeRegistration = async (userData, type) => {
    try {
      const user = {
        ...userData,
        id: `${type === 'talent' ? 'T' : 'C'}${Date.now()}`,
        memberSince: new Date().toISOString(),
        rating: 0,
        totalProjects: 0,
        totalReviews: 0,
      };

      await login(user, type);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    verifyOTP,
    completeRegistration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
