import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  MenuItem,
  CartItem,
  CartCustomization,
  Order,
  OrderStatus,
  UserProfile,
  ScreenName,
  ScreenParams,
} from '../types';
import { MENU_ITEMS } from '../data/mockData';
import {
  addItemToCart,
  updateItemQuantity,
  calculateCartTotals,
  validatePromoCode,
  getNextOrderStatus,
  generateOrderNumber,
  pushScreen,
  popScreen,
  ScreenStack,
} from '../utils/cartLogic';

interface AppContextType {
  currentScreen: ScreenName;
  screenParams: ScreenParams | undefined;
  navigateTo: (screen: ScreenName, params?: ScreenParams) => void;
  goBack: () => void;

  user: UserProfile | null;
  isGuest: boolean;
  loginUser: (emailOrId: string, role?: UserProfile['campusRole'], isGuestMode?: boolean) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;

  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;

  menuItems: MenuItem[];
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, customization?: CartCustomization) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  appliedPromoCode: string;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  cartSubtotal: number;
  cartTax: number;
  cartPackagingFee: number;
  cartTotal: number;
  cartItemCount: number;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrderById: (orderId: string) => void;
  placeOrder: (
    pickupTime: string,
    paymentMethod: Order['paymentMethod'],
    specialInstructions?: string,
  ) => Order;
  advanceOrderStatus: (orderId: string, specificStatus?: OrderStatus) => void;
  reorderPastOrder: (order: Order) => void;

  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screenStack, setScreenStack] = useState<ScreenStack>([{ screen: 'Splash' }]);
  const currentScreen = screenStack[screenStack.length - 1]?.screen || 'Splash';
  const screenParams = screenStack[screenStack.length - 1]?.params;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const navigateTo = (screen: ScreenName, params?: ScreenParams) => {
    setScreenStack((prev) => pushScreen(prev, screen, params));
  };

  const goBack = () => {
    setScreenStack((prev) => popScreen(prev));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const loginUser = (
    emailOrId: string,
    role: UserProfile['campusRole'] = 'Student',
    isGuestMode: boolean = false,
  ) => {
    if (isGuestMode) {
      setIsGuest(true);
      setUser({
        id: 'usr-guest',
        name: 'Guest Explorer',
        email: 'guest@quickbite.local',
        studentId: 'GUEST-ACCESS',
        campusRole: 'Guest',
        walletBalance: 1500.0,
        dietaryPreference: 'all',
      });
      showToast('Logged in as Campus Guest', 'success');
      navigateTo('Home');
      return;
    }

    const isEmail = emailOrId.includes('@');
    setIsGuest(false);
    setUser({
      id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
      name: isEmail
        ? emailOrId.split('@')[0]
        : role === 'Student'
          ? 'Campus Student'
          : 'Campus Staff',
      email: isEmail ? emailOrId : `${emailOrId.toLowerCase()}@campus.edu`,
      studentId: isEmail ? '' : emailOrId.toUpperCase(),
      campusRole: role,
      walletBalance: 4500.0,
      dietaryPreference: 'all',
    });
    showToast('Welcome to QuickBite Canteen!', 'success');
    navigateTo('Home');
  };

  const logoutUser = () => {
    setUser(null);
    setIsGuest(false);
    setCart([]);
    setAppliedPromoCode('');
    setOrders([]);
    setActiveOrderId(null);
    setFavorites([]);
    showToast('Signed out successfully', 'info');
    navigateTo('Login');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast('Profile updated', 'success');
  };

  const topUpWallet = (amount: number) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null));
      showToast(`Added Rs. ${amount.toFixed(2)} to Campus Wallet!`, 'success');
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      const updated = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites', 'info');
      return updated;
    });
  };

  const addToCart = (item: MenuItem, quantity: number = 1, customization?: CartCustomization) => {
    setCart((prev) => addItemToCart(prev, item, quantity, customization));
    showToast(`Added ${quantity}x "${item.name}" to cart!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) => updateItemQuantity(prev, cartItemId, newQuantity));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode('');
  };

  const applyPromoCode = (code: string) => {
    const result = validatePromoCode(code);
    if (result.success) {
      setAppliedPromoCode(result.code);
    }
    return { success: result.success, message: result.message };
  };

  const removePromoCode = () => {
    setAppliedPromoCode('');
    showToast('Promo code removed', 'info');
  };

  const cartTotals = useMemo(
    () => calculateCartTotals(cart, appliedPromoCode),
    [cart, appliedPromoCode],
  );
  const {
    subtotal: cartSubtotal,
    tax: cartTax,
    packagingFee: cartPackagingFee,
    discount: promoDiscount,
    total: cartTotal,
  } = cartTotals;

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === activeOrderId) || orders[0] || null;
  }, [orders, activeOrderId]);

  const setActiveOrderById = (orderId: string) => {
    setActiveOrderId(orderId);
  };

  const placeOrder = (
    pickupTime: string,
    paymentMethod: Order['paymentMethod'],
    specialInstructions?: string,
  ): Order => {
    const orderNumber = generateOrderNumber();
    const newOrderId = 'ord-' + Date.now();
    const counters = ['Express Counter 1', 'Express Counter 2', 'Snack Bar Counter 3'];
    const assignedCounter = counters[Math.floor(Math.random() * counters.length)];

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      packagingFee: cartPackagingFee,
      discount: promoDiscount,
      total: cartTotal,
      status: 'Placed',
      pickupTime: pickupTime || 'In ~10-15 mins',
      pickupCounter: assignedCounter,
      createdAt: 'Just now',
      paymentMethod,
      specialInstructions: specialInstructions?.trim() || undefined,
      qrCodeData: `QUICKBITE-ORDER-${orderNumber.replace('QB-', '')}-VERIFIED-${Date.now()}`,
    };

    if (paymentMethod === 'Campus Smartcard' && user) {
      setUser((prev) =>
        prev ? { ...prev, walletBalance: Math.max(0, prev.walletBalance - cartTotal) } : null,
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrderId);
    clearCart();
    showToast(`Order #${newOrder.orderNumber} placed`, 'success');
    navigateTo('OrderConfirmation', { orderId: newOrderId });

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, specificStatus?: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextStatus: OrderStatus = specificStatus || getNextOrderStatus(ord.status);

          showToast(`Order #${ord.orderNumber} is now: ${nextStatus}!`, 'info');
          return { ...ord, status: nextStatus };
        }
        return ord;
      }),
    );
  };

  const reorderPastOrder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.quantity, item.customization);
    });
    showToast(`Re-added ${order.items.length} item(s) to your cart!`, 'success');
    navigateTo('Cart');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenParams,
        navigateTo,
        goBack,
        user,
        isGuest,
        loginUser,
        logoutUser,
        updateUserProfile,
        topUpWallet,
        selectedMenuItem,
        setSelectedMenuItem,
        menuItems,
        favorites,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        appliedPromoCode,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        cartSubtotal,
        cartTax,
        cartPackagingFee,
        cartTotal,
        cartItemCount,
        orders,
        activeOrder,
        setActiveOrderById,
        placeOrder,
        advanceOrderStatus,
        reorderPastOrder,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
