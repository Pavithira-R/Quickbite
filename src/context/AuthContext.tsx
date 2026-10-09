import React, { createContext, ReactNode, useContext, useState } from 'react';
import { UserProfile } from '../types';
import { useNavigation } from './NavigationContext';
import { useToast } from './ToastContext';

type CampusRole = UserProfile['campusRole'];

interface AuthContextValue {
  user: UserProfile | null;
  isGuest: boolean;
  loginUser: (emailOrId: string, role?: CampusRole, isGuestMode?: boolean) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;
  chargeWallet: (amount: number) => void;
}

const GUEST_PROFILE: UserProfile = {
  id: 'usr-guest',
  name: 'Guest',
  email: 'guest@quickbite.local',
  studentId: 'GUEST-ACCESS',
  campusRole: 'Guest',
  walletBalance: 1500,
  dietaryPreference: 'all',
};

const createProfile = (emailOrId: string, role: CampusRole): UserProfile => {
  const isEmail = emailOrId.includes('@');
  const defaultName = role === 'Student' ? 'Campus Student' : 'Campus Staff';

  return {
    id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
    name: isEmail ? emailOrId.split('@')[0] : defaultName,
    email: isEmail ? emailOrId : `${emailOrId.toLowerCase()}@campus.edu`,
    studentId: isEmail ? '' : emailOrId.toUpperCase(),
    campusRole: role,
    walletBalance: 4500,
    dietaryPreference: 'all',
  };
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { navigateTo } = useNavigation();
  const { showToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);

  const isGuest = user?.campusRole === 'Guest';

  const loginUser = (emailOrId: string, role: CampusRole = 'Student', isGuestMode = false) => {
    setUser(isGuestMode ? GUEST_PROFILE : createProfile(emailOrId, role));
    showToast(isGuestMode ? 'Signed in as guest' : 'Signed in', 'success');
    navigateTo('Home');
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Signed out', 'info');
    navigateTo('Login');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast('Profile updated', 'success');
  };

  const topUpWallet = (amount: number) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null));
    showToast(`Rs. ${amount.toFixed(2)} added to your wallet`, 'success');
  };

  const chargeWallet = (amount: number) => {
    setUser((prev) =>
      prev ? { ...prev, walletBalance: Math.max(0, prev.walletBalance - amount) } : null,
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loginUser,
        logoutUser,
        updateUserProfile,
        topUpWallet,
        chargeWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
