import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Order, OrderStatus } from '../types';
import { generateOrderNumber, getNextOrderStatus } from '../utils/cartLogic';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useNavigation } from './NavigationContext';
import { useToast } from './ToastContext';

interface OrdersContextValue {
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
}

const PICKUP_COUNTERS = ['Express Counter 1', 'Express Counter 2', 'Snack Bar Counter 3'];

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { chargeWallet } = useAuth();
  const cart = useCart();
  const { navigateTo } = useNavigation();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null,
    [orders, activeOrderId],
  );

  const placeOrder = (
    pickupTime: string,
    paymentMethod: Order['paymentMethod'],
    specialInstructions?: string,
  ): Order => {
    const orderNumber = generateOrderNumber();
    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: [...cart.cart],
      subtotal: cart.cartSubtotal,
      tax: cart.cartTax,
      packagingFee: cart.cartPackagingFee,
      discount: cart.promoDiscount,
      total: cart.cartTotal,
      status: 'Placed',
      pickupTime: pickupTime || 'In ~10-15 mins',
      pickupCounter: PICKUP_COUNTERS[Math.floor(Math.random() * PICKUP_COUNTERS.length)],
      createdAt: 'Just now',
      paymentMethod,
      specialInstructions: specialInstructions?.trim() || undefined,
      qrCodeData: `QUICKBITE-ORDER-${orderNumber.replace('QB-', '')}-VERIFIED-${Date.now()}`,
    };

    if (paymentMethod === 'Campus Smartcard') {
      chargeWallet(order.total);
    }

    setOrders((prev) => [order, ...prev]);
    setActiveOrderId(order.id);
    cart.clearCart();
    showToast(`Order #${orderNumber} placed`, 'success');
    navigateTo('OrderConfirmation', { orderId: order.id });

    return order;
  };

  const advanceOrderStatus = (orderId: string, specificStatus?: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextStatus = specificStatus ?? getNextOrderStatus(order.status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
    showToast(`Order #${order.orderNumber}: ${nextStatus}`, 'info');
  };

  const reorderPastOrder = (order: Order) => {
    order.items.forEach((item) => cart.addToCart(item.menuItem, item.quantity, item.customization));
    showToast('Items added to your cart', 'success');
    navigateTo('Cart');
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrderById: setActiveOrderId,
        placeOrder,
        advanceOrderStatus,
        reorderPastOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within an OrdersProvider');
  return context;
};
