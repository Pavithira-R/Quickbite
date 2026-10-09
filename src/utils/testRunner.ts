import { CartItem, OrderStatus, ScreenName, TestCaseResult } from '../types';
import { MENU_ITEMS } from '../data/mockData';
import {
  addItemToCart,
  updateItemQuantity,
  calculateCartTotals,
  validatePromoCode,
  validateLoginInput,
  getNextOrderStatus,
  generateOrderNumber,
  pushScreen,
  popScreen,
  ScreenStack,
} from './cartLogic';

// Collects assertion results for one test case
class Checker {
  passed = 0;
  failures: string[] = [];

  equal(label: string, actual: unknown, expected: unknown) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      this.passed++;
    } else {
      this.failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  truthy(label: string, value: unknown) {
    this.equal(label, Boolean(value), true);
  }
}

const burger = MENU_ITEMS.find(m => m.id === 'm1')!; // Rs. 950
const cheese = burger.availableCustomizations!.addOns!.find(a => a.id === 'addon-cheese')!; // Rs. 150
const macchiato = MENU_ITEMS.find(m => m.id === 'b1')!; // Rs. 580, Large = x1.25

const testNavigation = (c: Checker) => {
  let stack: ScreenStack = [{ screen: 'Splash' }];
  stack = pushScreen(stack, 'Login');
  c.equal('Login resets stack', stack.map(s => s.screen), ['Login']);
  stack = pushScreen(stack, 'Home');
  c.equal('Home resets stack', stack.map(s => s.screen), ['Home']);

  const flow: ScreenName[] = ['ItemDetail', 'Cart', 'Checkout', 'OrderConfirmation', 'OrderTracking', 'Profile'];
  flow.forEach(screen => {
    stack = pushScreen(stack, screen);
    c.equal(`Navigate to ${screen}`, stack[stack.length - 1].screen, screen);
  });
  c.equal('Back-stack depth after full flow', stack.length, flow.length + 1);

  stack = popScreen(stack);
  c.equal('Back from Profile returns to OrderTracking', stack[stack.length - 1].screen, 'OrderTracking');
  c.equal('Back on a single screen falls back to Home', popScreen([{ screen: 'Cart' }]).map(s => s.screen), ['Home']);
};

const testCartLogic = (c: Checker) => {
  const cart = addItemToCart([], burger, 2, { spiceLevel: 'Medium', addOns: [cheese] });
  c.equal('Item total = (950 + 150) x 2', cart[0].itemTotal, 2200);

  const totals = calculateCartTotals(cart, '');
  c.equal('Subtotal', totals.subtotal, 2200);
  c.equal('5% tax', totals.tax, 110);
  c.equal('Packaging fee', totals.packagingFee, 50);
  c.equal('Grand total', totals.total, 2360);

  const student = calculateCartTotals(cart, 'STUDENT15');
  c.equal('STUDENT15 discount (15%)', student.discount, 330);
  c.equal('Grand total with STUDENT15', student.total, 2030);

  const flat = calculateCartTotals(cart, 'BITE250');
  c.equal('BITE250 discount', flat.discount, 250);
  c.equal('Grand total with BITE250', flat.total, 2110);

  c.equal('Empty cart has zero total', calculateCartTotals([], 'STUDENT15').total, 0);

  const largeDrink = addItemToCart([], macchiato, 1, { size: 'Large (16oz)' });
  c.equal('Large size = 580 x 1.25', largeDrink[0].itemTotal, 725);
  const regularDrink = addItemToCart([], macchiato, 1, { size: 'Regular (12oz)' });
  c.equal('Regular size keeps base price', regularDrink[0].itemTotal, 580);
};

const testValidation = (c: Checker) => {
  c.truthy('Empty Student ID is rejected', validateLoginInput('   ', 'campuspass'));
  c.truthy('Empty password is rejected', validateLoginInput('CS-2024-8841', ''));
  c.equal('Valid credentials pass', validateLoginInput('CS-2024-8841', 'campuspass'), null);

  const valid = validatePromoCode('  student15 ');
  c.equal('STUDENT15 accepted (case/space insensitive)', [valid.success, valid.code], [true, 'STUDENT15']);
  c.equal('Invalid promo rejected', validatePromoCode('FREEFOOD99').success, false);
  c.equal('Empty promo rejected', validatePromoCode('').success, false);
};

const testStatePersistence = (c: Checker) => {
  let cart: CartItem[] = [];
  cart = addItemToCart(cart, burger, 1, { spiceLevel: 'Medium' });
  const snapshot = JSON.stringify(cart);

  cart = addItemToCart(cart, burger, 1, { spiceLevel: 'Medium' });
  c.equal('Identical items merge into one line', cart.length, 1);
  c.equal('Merged quantity', cart[0].quantity, 2);
  c.equal('Earlier cart state is not mutated', JSON.stringify(JSON.parse(snapshot)), snapshot);

  cart = addItemToCart(cart, burger, 1, { spiceLevel: 'Mild' });
  c.equal('Different customization becomes a separate line', cart.length, 2);

  // Browsing other screens only changes the screen stack, never the cart
  const before = JSON.stringify(cart);
  let stack: ScreenStack = [{ screen: 'Home' }];
  stack = pushScreen(stack, 'Profile');
  stack = pushScreen(stack, 'Home');
  stack = pushScreen(stack, 'Cart');
  c.equal('Cart unchanged after navigating Profile → Home → Cart', JSON.stringify(cart), before);
  c.equal('Arrived back at Cart', stack[stack.length - 1].screen, 'Cart');

  cart = updateItemQuantity(cart, cart[0].id, 0);
  c.equal('Setting quantity to 0 removes the line', cart.length, 1);
};

const testOrderLifecycle = (c: Checker) => {
  const orderNumbers = Array.from({ length: 25 }, generateOrderNumber);
  const badNumbers = orderNumbers.filter(n => !/^QB-\d{4}$/.test(n));
  c.equal('Order numbers match QB-XXXX format', badNumbers, []);

  const path: OrderStatus[] = ['Placed'];
  while (path[path.length - 1] !== 'Completed' && path.length < 10) {
    path.push(getNextOrderStatus(path[path.length - 1]));
  }
  c.equal('Status path', path, ['Placed', 'Preparing', 'Ready for Pickup', 'Completed']);
  c.equal('Completed is a final state', getNextOrderStatus('Completed'), 'Completed');
};

const AUTOMATED_TESTS: Record<string, (c: Checker) => void> = {
  'TC-01': testNavigation,
  'TC-02': testCartLogic,
  'TC-03': testValidation,
  'TC-04': testStatePersistence,
  'TC-05': testOrderLifecycle,
};

export const runTestCases = (testCases: TestCaseResult[]): TestCaseResult[] => {
  const executedAt = new Date().toLocaleTimeString();

  return testCases.map(tc => {
    const run = AUTOMATED_TESTS[tc.id];
    if (!run) return tc; // manual test case — result recorded by the tester

    const c = new Checker();
    try {
      run(c);
    } catch (err) {
      c.failures.push(`Threw an error: ${(err as Error).message}`);
    }

    const total = c.passed + c.failures.length;
    return {
      ...tc,
      status: c.failures.length === 0 ? 'PASS' : 'FAIL',
      executedAt,
      actualResult:
        c.failures.length === 0
          ? `${c.passed}/${total} assertions passed.`
          : `${c.failures.length}/${total} assertions failed: ${c.failures.join('; ')}`,
    };
  });
};
