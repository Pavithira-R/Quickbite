import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './CartContext';
import { MenuProvider } from './MenuContext';
import { NavigationProvider } from './NavigationContext';
import { OrdersProvider } from './OrdersContext';
import { ToastProvider } from './ToastContext';

// Keyed by user so favourites, cart and orders start fresh whenever someone signs in or out
const SessionProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <MenuProvider key={user?.id ?? 'signed-out'}>
      <CartProvider>
        <OrdersProvider>{children}</OrdersProvider>
      </CartProvider>
    </MenuProvider>
  );
};

// Order matters: each provider can use the hooks of the providers above it
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ToastProvider>
    <NavigationProvider>
      <AuthProvider>
        <SessionProviders>{children}</SessionProviders>
      </AuthProvider>
    </NavigationProvider>
  </ToastProvider>
);
