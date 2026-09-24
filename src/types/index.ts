export type CategoryId = 'all' | 'meals' | 'beverages' | 'snacks' | 'combos' | 'desserts';

export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  rating: number;
  reviewsCount: number;
  prepTime: string; // e.g. "8-12 min"
  calories: string;
  dietary: DietaryType;
  image: string;
  description: string;
  isPopular?: boolean;
  isSpecial?: boolean;
  availableCustomizations?: {
    sizes?: { name: string; priceMultiplier: number }[];
    spiceLevels?: ('Mild' | 'Medium' | 'Extra Spicy')[];
    addOns?: CustomizationOption[];
  };
}

export interface CartCustomization {
  size?: string;
  spiceLevel?: string;
  addOns?: CustomizationOption[];
  notes?: string;
}

export interface CartItem {
  id: string; // unique item-in-cart key
  menuItem: MenuItem;
  quantity: number;
  customization?: CartCustomization;
  itemTotal: number;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  packagingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  pickupTime: string;
  pickupCounter: string;
  createdAt: string;
  paymentMethod: 'Campus Smartcard' | 'UPI / GPay' | 'Credit/Debit Card' | 'Cash on Pickup';
  specialInstructions?: string;
  qrCodeData: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  campusRole: 'Student' | 'Faculty / Staff' | 'Guest';
  walletBalance: number;
  dietaryPreference: 'all' | 'veg';
  phone: string;
}

export type ScreenName = 
  | 'Splash'
  | 'Login'
  | 'Home'
  | 'ItemDetail'
  | 'Cart'
  | 'Checkout'
  | 'OrderConfirmation'
  | 'OrderTracking'
  | 'Profile'
  | 'TestSuite';

export interface TestCaseResult {
  id: string;
  title: string;
  category: 'Navigation' | 'Cart Logic' | 'Validation' | 'State Persistence' | 'Layout & Responsive' | 'Order Lifecycle';
  description: string;
  steps: string[];
  expectedResult: string;
  actualResult: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  executedAt?: string;
}
