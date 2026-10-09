import { CartItem, CartCustomization, MenuItem, OrderStatus, ScreenName } from '../types';

export const TAX_RATE = 0.05; // 5% campus tax
export const PACKAGING_FEE = 50.00; // Rs. 50 flat packaging fee
export const FLAT_PROMO_DISCOUNT = 250.00; // Rs. 250 off

const round2 = (value: number) => parseFloat(value.toFixed(2));

// Unique key so identical item + customization combos merge into one cart line
export const buildCartKey = (item: MenuItem, customization?: CartCustomization) =>
  `${item.id}-${customization?.size || 'std'}-${customization?.spiceLevel || 'std'}-${(customization?.addOns || []).map(a => a.id).sort().join('_')}`;

// Size multiplier applies to the base price only; add-ons keep their flat price
export const getSizeMultiplier = (item: MenuItem, sizeName?: string) =>
  item.availableCustomizations?.sizes?.find(s => s.name === sizeName)?.priceMultiplier ?? 1;

export const calculateUnitPrice = (item: MenuItem, customization?: CartCustomization) => {
  const basePrice = round2(item.price * getSizeMultiplier(item, customization?.size));
  const addOnsTotal = (customization?.addOns || []).reduce((acc, curr) => acc + curr.price, 0);
  return basePrice + addOnsTotal;
};

export const addItemToCart = (
  cart: CartItem[],
  item: MenuItem,
  quantity: number,
  customization?: CartCustomization
): CartItem[] => {
  const customKey = buildCartKey(item, customization);
  const unitPrice = calculateUnitPrice(item, customization);
  const existingIndex = cart.findIndex(c => c.id === customKey);

  if (existingIndex > -1) {
    const updated = [...cart];
    const newQty = updated[existingIndex].quantity + quantity;
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: newQty,
      itemTotal: round2(unitPrice * newQty),
    };
    return updated;
  }

  return [
    ...cart,
    {
      id: customKey,
      menuItem: item,
      quantity,
      customization,
      itemTotal: round2(unitPrice * quantity),
    },
  ];
};

export const updateItemQuantity = (cart: CartItem[], cartItemId: string, newQuantity: number): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter(item => item.id !== cartItemId);
  }
  return cart.map(item =>
    item.id === cartItemId
      ? {
          ...item,
          quantity: newQuantity,
          itemTotal: round2(calculateUnitPrice(item.menuItem, item.customization) * newQuantity),
        }
      : item
  );
};

// Promo codes
export const normalizePromoCode = (code: string) => code.trim().toUpperCase();

export const isPercentPromo = (code: string) => code === 'STUDENT15' || code === 'QUICK15';
export const isFlatPromo = (code: string) => code === 'FREEDRINK' || code === 'BITE250';

export const validatePromoCode = (code: string): { success: boolean; message: string; code: string } => {
  const cleanCode = normalizePromoCode(code);
  if (isPercentPromo(cleanCode)) {
    return { success: true, message: '15% Student Discount applied!', code: cleanCode };
  }
  if (isFlatPromo(cleanCode)) {
    return { success: true, message: 'Rs. 250.00 discount applied successfully!', code: cleanCode };
  }
  return { success: false, message: 'Invalid or expired promo code', code: cleanCode };
};

export interface CartTotals {
  subtotal: number;
  tax: number;
  packagingFee: number;
  discount: number;
  total: number;
}

export const calculateCartTotals = (cart: CartItem[], promoCode: string): CartTotals => {
  const subtotal = round2(cart.reduce((acc, item) => acc + item.itemTotal, 0));
  if (subtotal === 0) {
    return { subtotal: 0, tax: 0, packagingFee: 0, discount: 0, total: 0 };
  }

  const tax = round2(subtotal * TAX_RATE);
  const packagingFee = PACKAGING_FEE;

  let discount = 0;
  if (isPercentPromo(promoCode)) {
    discount = round2(subtotal * 0.15);
  } else if (isFlatPromo(promoCode)) {
    discount = Math.min(FLAT_PROMO_DISCOUNT, subtotal);
  }

  const total = round2(Math.max(0, subtotal + tax + packagingFee - discount));
  return { subtotal, tax, packagingFee, discount, total };
};

// Login form validation — returns an error message, or null when valid
export const validateLoginInput = (studentIdOrEmail: string, password: string): string | null => {
  if (!studentIdOrEmail.trim()) {
    return 'Please enter your Student ID or Campus Email.';
  }
  if (!password.trim()) {
    return 'Please enter your password.';
  }
  return null;
};

// Order lifecycle: Placed → Preparing → Ready for Pickup → Completed
export const getNextOrderStatus = (status: OrderStatus): OrderStatus => {
  switch (status) {
    case 'Placed':
      return 'Preparing';
    case 'Preparing':
      return 'Ready for Pickup';
    default:
      return 'Completed';
  }
};

export const generateOrderNumber = () => `QB-${Math.floor(1000 + Math.random() * 9000)}`;

// Navigation stack: Splash, Login and Home reset the stack; other screens push onto it
export type ScreenStack = { screen: ScreenName; params?: any }[];

export const pushScreen = (stack: ScreenStack, screen: ScreenName, params?: any): ScreenStack => {
  if (screen === 'Splash' || screen === 'Login' || screen === 'Home') {
    return [{ screen, params }];
  }
  return [...stack, { screen, params }];
};

export const popScreen = (stack: ScreenStack): ScreenStack =>
  stack.length > 1 ? stack.slice(0, -1) : [{ screen: 'Home' }];
