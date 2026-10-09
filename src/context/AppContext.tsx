import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  MenuItem, 
  CartItem, 
  CartCustomization, 
  Order, 
  OrderStatus, 
  UserProfile, 
  ScreenName,
  TestCaseResult 
} from '../types';
import { MENU_ITEMS, INITIAL_USER_PROFILE, INITIAL_SAMPLE_ORDERS } from '../data/mockData';
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
import { runTestCases } from '../utils/testRunner';

interface AppContextType {
  // Navigation
  currentScreen: ScreenName;
  screenParams: any;
  navigateTo: (screen: ScreenName, params?: any) => void;
  goBack: () => void;
  
  // Auth / User
  user: UserProfile | null;
  isGuest: boolean;
  loginUser: (emailOrId: string, name?: string, isGuestMode?: boolean) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;

  // Selected item for detail view
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;

  // Menu items & favorites
  menuItems: MenuItem[];
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, customization?: CartCustomization) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  appliedPromoCode: string;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Computed Cart values
  cartSubtotal: number;
  cartTax: number;
  cartPackagingFee: number;
  cartTotal: number;
  cartItemCount: number;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrderById: (orderId: string) => void;
  placeOrder: (
    pickupTime: string, 
    paymentMethod: Order['paymentMethod'], 
    specialInstructions?: string
  ) => Order;
  advanceOrderStatus: (orderId: string, specificStatus?: OrderStatus) => void;
  reorderPastOrder: (order: Order) => void;

  // Automated Testing Suite (Part D)
  testCases: TestCaseResult[];
  runTestSuite: () => void;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [screenStack, setScreenStack] = useState<ScreenStack>([
    { screen: 'Splash' }
  ]);
  const currentScreen = screenStack[screenStack.length - 1]?.screen || 'Splash';
  const screenParams = screenStack[screenStack.length - 1]?.params;

  // User state
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER_PROFILE);
  const [isGuest, setIsGuest] = useState(false);

  // Menu & Selection
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(MENU_ITEMS[0]);
  const [favorites, setFavorites] = useState<string[]>(['m1', 'b1', 'c1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-sample-item-1',
      menuItem: MENU_ITEMS[0],
      quantity: 1,
      customization: { spiceLevel: 'Medium' },
      itemTotal: 950.00,
    }
  ]);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState<string | null>('ord-101');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Navigation handlers
  const navigateTo = (screen: ScreenName, params?: any) => {
    setScreenStack(prev => pushScreen(prev, screen, params));
  };

  const goBack = () => {
    setScreenStack(prev => popScreen(prev));
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Auth actions
  const loginUser = (emailOrId: string, name?: string, isGuestMode: boolean = false) => {
    if (isGuestMode) {
      setIsGuest(true);
      setUser({
        id: 'usr-guest',
        name: 'Guest Explorer',
        email: 'guest@quickbite.local',
        studentId: 'GUEST-ACCESS',
        campusRole: 'Guest',
        walletBalance: 1500.00,
        dietaryPreference: 'all',
        phone: 'N/A'
      });
      showToast('Logged in as Campus Guest', 'success');
      navigateTo('Home');
      return;
    }

    setIsGuest(false);
    setUser({
      id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
      name: name || (emailOrId.includes('@') ? emailOrId.split('@')[0] : 'Campus Student'),
      email: emailOrId.includes('@') ? emailOrId : `${emailOrId.toLowerCase()}@campus.edu`,
      studentId: emailOrId.includes('@') ? 'STU-9921' : emailOrId.toUpperCase(),
      campusRole: 'Student',
      walletBalance: 4500.00,
      dietaryPreference: 'all',
      phone: '+1 (555) 839-2019'
    });
    showToast('Welcome to QuickBite Canteen!', 'success');
    navigateTo('Home');
  };

  const logoutUser = () => {
    setUser(null);
    setIsGuest(false);
    showToast('Signed out successfully', 'info');
    navigateTo('Login');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    showToast('Profile updated', 'success');
  };

  const topUpWallet = (amount: number) => {
    if (user) {
      setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null);
      showToast(`Added Rs. ${amount.toFixed(2)} to Campus Wallet!`, 'success');
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(itemId);
      const updated = exists ? prev.filter(id => id !== itemId) : [...prev, itemId];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites ❤️', 'info');
      return updated;
    });
  };

  // Cart operations
  const addToCart = (item: MenuItem, quantity: number = 1, customization?: CartCustomization) => {
    setCart(prev => addItemToCart(prev, item, quantity, customization));
    showToast(`Added ${quantity}x "${item.name}" to cart!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev => updateItemQuantity(prev, cartItemId, newQuantity));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode('');
  };

  // Promo code discounts
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

  // Calculations
  const cartTotals = useMemo(() => calculateCartTotals(cart, appliedPromoCode), [cart, appliedPromoCode]);
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

  // Orders logic
  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === activeOrderId) || orders[0] || null;
  }, [orders, activeOrderId]);

  const setActiveOrderById = (orderId: string) => {
    setActiveOrderId(orderId);
  };

  const placeOrder = (
    pickupTime: string, 
    paymentMethod: Order['paymentMethod'], 
    specialInstructions?: string
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

    // Deduct from wallet if smartcard
    if (paymentMethod === 'Campus Smartcard' && user) {
      setUser(prev => prev ? { ...prev, walletBalance: Math.max(0, prev.walletBalance - cartTotal) } : null);
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrderId);
    clearCart();
    showToast(`Order #${newOrder.orderNumber} placed successfully! 🍕`, 'success');
    navigateTo('OrderConfirmation', { orderId: newOrderId });

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, specificStatus?: OrderStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const nextStatus: OrderStatus = specificStatus || getNextOrderStatus(ord.status);

        showToast(`Order #${ord.orderNumber} is now: ${nextStatus}!`, 'info');
        return { ...ord, status: nextStatus };
      }
      return ord;
    }));
  };

  const reorderPastOrder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.menuItem, item.quantity, item.customization);
    });
    showToast(`Re-added ${order.items.length} item(s) to your cart!`, 'success');
    navigateTo('Cart');
  };

  // Test Suite State & Runner (Part D)
  const [testCases, setTestCases] = useState<TestCaseResult[]>([
    {
      id: 'TC-01',
      title: 'Screen Navigation Flow',
      category: 'Navigation',
      description: 'Verify seamless navigation across Splash → Login → Home → Item Detail → Cart → Checkout → Confirmation → Tracking → Profile.',
      steps: ['Login and Home reset the navigation stack', 'Push Item Detail → Cart → Checkout → Confirmation → Tracking → Profile', 'Go back and verify the previous screen is restored'],
      expectedResult: 'Each navigation lands on the requested screen and Back restores the previous one.',
      actualResult: 'Not run yet. Tap "Run Automated Tests" to execute.',
      status: 'PENDING'
    },
    {
      id: 'TC-02',
      title: 'Dynamic Cart Subtotal & Add-to-Cart Logic',
      category: 'Cart Logic',
      description: 'Verify adding items with quantities and customizations correctly recalculates subtotal, taxes (5%), packaging (Rs. 50.00), and promo discounts.',
      steps: ['Add 2x Smash Burger (Rs. 950.00) with Extra Cheddar (Rs. 150.00)', 'Verify item total Rs. 2,200.00, tax Rs. 110.00, packaging Rs. 50.00, grand total Rs. 2,360.00', 'Apply STUDENT15 (total Rs. 2,030.00) and BITE250 (total Rs. 2,110.00)'],
      expectedResult: 'Cart subtotal matches exact mathematical sum of items + modifications.',
      actualResult: 'Not run yet. Tap "Run Automated Tests" to execute.',
      status: 'PENDING'
    },
    {
      id: 'TC-03',
      title: 'Form & Input Validation',
      category: 'Validation',
      description: 'Verify user login form checks for empty inputs and valid student roll/email credentials or guest toggle.',
      steps: ['Attempt login with empty Student ID, then empty password', 'Enter valid Student ID and password', 'Test promo code input with STUDENT15 and an invalid string'],
      expectedResult: 'Proper validation messages triggered; valid codes apply discount.',
      actualResult: 'Not run yet. Tap "Run Automated Tests" to execute.',
      status: 'PENDING'
    },
    {
      id: 'TC-04',
      title: 'Cart State Persistence Across Screens',
      category: 'State Persistence',
      description: 'Verify that items added to cart remain intact when user browses other categories, views item details, and returns.',
      steps: ['Add the same item twice (merges) and a different customization (separate line)', 'Navigate to Profile and Home', 'Return to Cart screen and compare cart contents'],
      expectedResult: 'Cart retains all selected items, quantities, and customizations.',
      actualResult: 'Not run yet. Tap "Run Automated Tests" to execute.',
      status: 'PENDING'
    },
    {
      id: 'TC-05',
      title: 'Order Placement & Multi-Stage Status Lifecycle',
      category: 'Order Lifecycle',
      description: 'Verify simulated order placement generates unique Order ID and advances through Placed → Preparing → Ready for Pickup → Completed.',
      steps: ['Generate order numbers and verify #QB-XXXX format', 'Advance status from Placed until Completed', 'Verify Completed is a final state'],
      expectedResult: 'Order numbers match #QB-XXXX and status follows Placed → Preparing → Ready for Pickup → Completed.',
      actualResult: 'Not run yet. Tap "Run Automated Tests" to execute.',
      status: 'PENDING'
    },
    {
      id: 'TC-06',
      title: 'Responsive Layout Adaptability',
      category: 'Layout & Responsive',
      description: 'Verify UI adapts gracefully to both phone and tablet/web screen widths with clean grid/list scaling.',
      steps: ['Test narrow mobile portrait view (375px)', 'Test wider tablet/desktop view (768px+)', 'Check touch targets and button sizes'],
      expectedResult: 'Cards, sticky checkout footer, and grids adjust responsively without layout clipping.',
      actualResult: 'Manual check: verified with the Phone (390px), Tablet (720px) and Full Width viewport switcher on web. Layout cannot be asserted from app logic, so this case is not part of the automated run.',
      status: 'PASS',
      executedAt: 'Manual'
    }
  ]);

  const runTestSuite = () => {
    const updated = runTestCases(testCases);
    setTestCases(updated);

    const passed = updated.filter(tc => tc.status === 'PASS').length;
    const allPassed = passed === updated.length;
    showToast(
      `Test Suite executed: ${passed}/${updated.length} passed${allPassed ? ' ✅' : ''}`,
      allPassed ? 'success' : 'error'
    );
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
        testCases,
        runTestSuite,
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
