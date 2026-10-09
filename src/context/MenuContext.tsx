import React, { createContext, ReactNode, useContext, useState } from 'react';
import { MENU_ITEMS } from '../data/mockData';
import { MenuItem } from '../types';
import { useToast } from './ToastContext';

interface MenuContextValue {
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleFavorite = (itemId: string) => {
    const isFavorite = favorites.includes(itemId);
    setFavorites((prev) => (isFavorite ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    showToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites', 'info');
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems: MENU_ITEMS,
        selectedMenuItem,
        setSelectedMenuItem,
        favorites,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
