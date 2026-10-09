import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { CartCustomization, CartItem, MenuItem } from '../types';
import {
  addItemToCart,
  calculateCartTotals,
  updateItemQuantity,
  validatePromoCode,
} from '../utils/cartLogic';
import { useToast } from './ToastContext';

interface CartContextValue {
  cart: CartItem[];
  cartItemCount: number;
  addToCart: (item: MenuItem, quantity: number, customization?: CartCustomization) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;

  appliedPromoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  cartSubtotal: number;
  cartTax: number;
  cartPackagingFee: number;
  promoDiscount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode('');
  };

  const addToCart = (item: MenuItem, quantity = 1, customization?: CartCustomization) => {
    setCart((prev) => addItemToCart(prev, item, quantity, customization));
    showToast(`Added ${quantity} × ${item.name}`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Removed from cart', 'info');
  };

  const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) => updateItemQuantity(prev, cartItemId, newQuantity));
  };

  const applyPromoCode = (code: string) => {
    const result = validatePromoCode(code);
    if (result.success) setAppliedPromoCode(result.code);
    return { success: result.success, message: result.message };
  };

  const removePromoCode = () => {
    setAppliedPromoCode('');
    showToast('Promo code removed', 'info');
  };

  const totals = useMemo(
    () => calculateCartTotals(cart, appliedPromoCode),
    [cart, appliedPromoCode],
  );
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
        cartSubtotal: totals.subtotal,
        cartTax: totals.tax,
        cartPackagingFee: totals.packagingFee,
        promoDiscount: totals.discount,
        cartTotal: totals.total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
