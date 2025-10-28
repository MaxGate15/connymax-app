import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type UserType = 'customer' | 'vendor';

interface User {
  type: UserType;
  name: string;
  email: string;
  password?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  phoneNumber?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  getUserByEmail: (email: string) => Promise<User | null>;
  getAllUsers: () => Promise<User[]>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const getAllUsersFromStorage = useCallback(async (): Promise<User[]> => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }, []);

  const saveUserToStorage = useCallback(async (userData: User) => {
    try {
      const allUsers = await getAllUsersFromStorage();
      const existingIndex = allUsers.findIndex(u => u.email === userData.email);
      
      if (existingIndex >= 0) {
        allUsers[existingIndex] = userData;
      } else {
        allUsers.push(userData);
      }
      
      await AsyncStorage.setItem('users', JSON.stringify(allUsers));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, [getAllUsersFromStorage]);

  // Save user to storage when it changes
  useEffect(() => {
    if (user) {
      saveUserToStorage(user);
    }
  }, [user, saveUserToStorage]);

  const getUserByEmail = useCallback(async (email: string): Promise<User | null> => {
    try {
      const allUsers = await getAllUsersFromStorage();
      return allUsers.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }, [getAllUsersFromStorage]);

  const getAllUsers = useCallback(async (): Promise<User[]> => {
    return getAllUsersFromStorage();
  }, [getAllUsersFromStorage]);

  return (
    <UserContext.Provider value={{ user, setUser, getUserByEmail, getAllUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

