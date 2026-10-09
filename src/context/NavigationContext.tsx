import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ScreenName, ScreenParams } from '../types';
import { popScreen, pushScreen, ScreenStack } from '../utils/cartLogic';

interface NavigationContextValue {
  currentScreen: ScreenName;
  screenParams: ScreenParams | undefined;
  navigateTo: (screen: ScreenName, params?: ScreenParams) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<ScreenStack>([{ screen: 'Splash' }]);
  const top = stack[stack.length - 1];

  const navigateTo = (screen: ScreenName, params?: ScreenParams) => {
    setStack((prev) => pushScreen(prev, screen, params));
  };

  const goBack = () => {
    setStack((prev) => popScreen(prev));
  };

  return (
    <NavigationContext.Provider
      value={{ currentScreen: top.screen, screenParams: top.params, navigateTo, goBack }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
