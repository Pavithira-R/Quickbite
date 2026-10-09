import { MENU_ITEMS } from '../../data/mockData';
import { CartItem, OrderStatus } from '../../types';
import {
  addItemToCart,
  buildCartKey,
  calculateCartTotals,
  generateOrderNumber,
  getNextOrderStatus,
  popScreen,
  pushScreen,
  ScreenStack,
  updateItemQuantity,
  validateLoginInput,
  validatePromoCode,
} from '../cartLogic';

const burger = MENU_ITEMS.find((m) => m.id === 'm1')!; // Rs. 950
const cheese = burger.availableCustomizations!.addOns!.find((a) => a.id === 'addon-cheese')!; // Rs. 150
const macchiato = MENU_ITEMS.find((m) => m.id === 'b1')!; // Rs. 580, Large = x1.25

describe('cart pricing', () => {
  const cart = addItemToCart([], burger, 2, { spiceLevel: 'Medium', addOns: [cheese] });

  it('multiplies (base + add-ons) by quantity', () => {
    expect(cart[0].itemTotal).toBe(2200);
  });

  it('adds 5% tax and Rs. 50 packaging', () => {
    expect(calculateCartTotals(cart, '')).toEqual({
      subtotal: 2200,
      tax: 110,
      packagingFee: 50,
      discount: 0,
      total: 2360,
    });
  });

  it('applies a 15% discount for STUDENT15', () => {
    const totals = calculateCartTotals(cart, 'STUDENT15');
    expect(totals.discount).toBe(330);
    expect(totals.total).toBe(2030);
  });

  it('applies a flat Rs. 250 discount for BITE250', () => {
    const totals = calculateCartTotals(cart, 'BITE250');
    expect(totals.discount).toBe(250);
    expect(totals.total).toBe(2110);
  });

  it('never discounts more than the subtotal', () => {
    const cheapCart = addItemToCart([], { ...burger, price: 100 }, 1);
    expect(calculateCartTotals(cheapCart, 'BITE250').discount).toBe(100);
  });

  it('returns all zeros for an empty cart', () => {
    expect(calculateCartTotals([], 'STUDENT15')).toEqual({
      subtotal: 0,
      tax: 0,
      packagingFee: 0,
      discount: 0,
      total: 0,
    });
  });

  it('applies the size multiplier to the base price', () => {
    expect(addItemToCart([], macchiato, 1, { size: 'Large (16oz)' })[0].itemTotal).toBe(725);
    expect(addItemToCart([], macchiato, 1, { size: 'Regular (12oz)' })[0].itemTotal).toBe(580);
  });
});

describe('cart updates', () => {
  it('merges identical items into one line', () => {
    let cart: CartItem[] = addItemToCart([], burger, 1, { spiceLevel: 'Medium' });
    cart = addItemToCart(cart, burger, 1, { spiceLevel: 'Medium' });
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
    expect(cart[0].itemTotal).toBe(1900);
  });

  it('keeps different customizations as separate lines', () => {
    let cart = addItemToCart([], burger, 1, { spiceLevel: 'Medium' });
    cart = addItemToCart(cart, burger, 1, { spiceLevel: 'Mild' });
    expect(cart).toHaveLength(2);
  });

  it('builds the same key regardless of add-on order', () => {
    const bacon = burger.availableCustomizations!.addOns!.find((a) => a.id === 'addon-bacon')!;
    expect(buildCartKey(burger, { addOns: [cheese, bacon] })).toBe(
      buildCartKey(burger, { addOns: [bacon, cheese] }),
    );
  });

  it('does not mutate the previous cart', () => {
    const first = addItemToCart([], burger, 1);
    const snapshot = JSON.stringify(first);
    addItemToCart(first, burger, 1);
    expect(JSON.stringify(first)).toBe(snapshot);
  });

  it('recalculates the line total when quantity changes', () => {
    const cart = addItemToCart([], burger, 1, { addOns: [cheese] });
    expect(updateItemQuantity(cart, cart[0].id, 3)[0].itemTotal).toBe(3300);
  });

  it('removes the line when quantity drops to 0', () => {
    const cart = addItemToCart([], burger, 1);
    expect(updateItemQuantity(cart, cart[0].id, 0)).toHaveLength(0);
  });
});

describe('validation', () => {
  it('rejects an empty Student ID', () => {
    expect(validateLoginInput('   ', 'campuspass')).toBe(
      'Please enter your Student ID or Campus Email.',
    );
  });

  it('rejects an empty password', () => {
    expect(validateLoginInput('CS-2024-8841', '')).toBe('Please enter your password.');
  });

  it('accepts valid credentials', () => {
    expect(validateLoginInput('CS-2024-8841', 'campuspass')).toBeNull();
  });

  it('accepts promo codes regardless of case and spacing', () => {
    expect(validatePromoCode('  student15 ')).toMatchObject({ success: true, code: 'STUDENT15' });
  });

  it('rejects unknown and empty promo codes', () => {
    expect(validatePromoCode('FREEFOOD99').success).toBe(false);
    expect(validatePromoCode('').success).toBe(false);
  });
});

describe('order lifecycle', () => {
  it('generates order numbers in QB-XXXX format', () => {
    for (let i = 0; i < 25; i++) {
      expect(generateOrderNumber()).toMatch(/^QB-\d{4}$/);
    }
  });

  it('moves Placed → Preparing → Ready for Pickup → Completed', () => {
    const path: OrderStatus[] = ['Placed'];
    while (path[path.length - 1] !== 'Completed' && path.length < 10) {
      path.push(getNextOrderStatus(path[path.length - 1]));
    }
    expect(path).toEqual(['Placed', 'Preparing', 'Ready for Pickup', 'Completed']);
  });

  it('treats Completed as a final state', () => {
    expect(getNextOrderStatus('Completed')).toBe('Completed');
  });
});

describe('navigation stack', () => {
  it('resets the stack on Login and Home', () => {
    expect(pushScreen([{ screen: 'Splash' }], 'Login')).toEqual([
      { screen: 'Login', params: undefined },
    ]);
    expect(pushScreen([{ screen: 'Cart' }, { screen: 'Checkout' }], 'Home')).toEqual([
      { screen: 'Home', params: undefined },
    ]);
  });

  it('pushes other screens and pops back to the previous one', () => {
    let stack: ScreenStack = [{ screen: 'Home' }];
    stack = pushScreen(stack, 'ItemDetail');
    stack = pushScreen(stack, 'Cart');
    expect(stack.map((s) => s.screen)).toEqual(['Home', 'ItemDetail', 'Cart']);
    expect(popScreen(stack).map((s) => s.screen)).toEqual(['Home', 'ItemDetail']);
  });

  it('falls back to Home when popping the last screen', () => {
    expect(popScreen([{ screen: 'Cart' }])).toEqual([{ screen: 'Home' }]);
  });
});
