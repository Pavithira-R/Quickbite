import { MenuItem, UserProfile, Order } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: 'fast-food-outline' },
  { id: 'meals', label: 'Meals', icon: 'restaurant-outline' },
  { id: 'beverages', label: 'Beverages', icon: 'cafe-outline' },
  { id: 'snacks', label: 'Snacks', icon: 'pizza-outline' },
  { id: 'combos', label: 'Combos', icon: 'sparkles-outline' },
  { id: 'desserts', label: 'Desserts', icon: 'ice-cream-outline' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // MEALS
  {
    id: 'm1',
    name: 'Campus Classic Smash Burger',
    category: 'meals',
    price: 6.99,
    rating: 4.8,
    reviewsCount: 142,
    prepTime: '8-10 min',
    calories: '540 kcal',
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy smashed beef patty with melted aged cheddar, crisp iceberg lettuce, caramelized onions, pickles, and signature QuickBite house sauce in a toasted brioche bun.',
    isPopular: true,
    availableCustomizations: {
      spiceLevels: ['Mild', 'Medium', 'Extra Spicy'],
      addOns: [
        { id: 'addon-cheese', name: 'Extra Melted Cheddar', price: 0.99 },
        { id: 'addon-bacon', name: 'Crispy Turkey Bacon', price: 1.49 },
        { id: 'addon-jalapeno', name: 'Pickled Jalapeños', price: 0.50 },
      ],
    },
  },
  {
    id: 'm2',
    name: 'Grilled Chicken Burrito Bowl',
    category: 'meals',
    price: 7.49,
    rating: 4.9,
    reviewsCount: 98,
    prepTime: '6-8 min',
    calories: '610 kcal',
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
    description: 'Cilantro-lime brown rice topped with marinated grilled chicken breast, black beans, charred corn, fresh pico de gallo, guacamole, and chipotle crema.',
    isPopular: true,
    availableCustomizations: {
      spiceLevels: ['Mild', 'Medium', 'Extra Spicy'],
      addOns: [
        { id: 'addon-guac', name: 'Extra Scoop Guacamole', price: 1.25 },
        { id: 'addon-sourcream', name: 'Side Sour Cream', price: 0.50 },
      ],
    },
  },
  {
    id: 'm3',
    name: 'Paneer Tikka Rice Bowl',
    category: 'meals',
    price: 6.49,
    rating: 4.7,
    reviewsCount: 86,
    prepTime: '7-9 min',
    calories: '490 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    description: 'Tandoori-spiced cottage cheese cubes charred to perfection with roasted bell peppers and spiced basmati rice, served with mint chutney.',
    isPopular: false,
    availableCustomizations: {
      spiceLevels: ['Mild', 'Medium', 'Extra Spicy'],
      addOns: [
        { id: 'addon-chutney', name: 'Extra Mint Yogurt Dip', price: 0.40 },
        { id: 'addon-paneer', name: 'Extra Paneer Portion', price: 1.50 },
      ],
    },
  },
  {
    id: 'm4',
    name: 'Vegan Buddha Grain Bowl',
    category: 'meals',
    price: 6.99,
    rating: 4.6,
    reviewsCount: 54,
    prepTime: '5-7 min',
    calories: '420 kcal',
    dietary: 'vegan',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Nutritious quinoa, roasted chickpeas, massaged kale, edamame, sliced avocado, pickled red cabbage, and creamy tahini lemon dressing.',
    availableCustomizations: {
      addOns: [
        { id: 'addon-tofu', name: 'Crispy Grilled Tofu', price: 1.20 },
        { id: 'addon-avocado', name: 'Half Avocado Slices', price: 1.00 },
      ],
    },
  },

  // SNACKS
  {
    id: 's1',
    name: 'Crispy Loaded Waffle Fries',
    category: 'snacks',
    price: 3.99,
    rating: 4.8,
    reviewsCount: 165,
    prepTime: '5 min',
    calories: '380 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    description: 'Golden seasoned criss-cut waffle fries drenched in warm queso cheese sauce, fresh scallions, and signature spicy dust.',
    isPopular: true,
    availableCustomizations: {
      spiceLevels: ['Mild', 'Medium', 'Extra Spicy'],
      addOns: [
        { id: 'addon-jalapeno-f', name: 'Jalapeños', price: 0.45 },
        { id: 'addon-ranch', name: 'Ranch Dipping Cup', price: 0.50 },
      ],
    },
  },
  {
    id: 's2',
    name: 'Spicy Mozzarella Sticks (5 pcs)',
    category: 'snacks',
    price: 4.49,
    rating: 4.7,
    reviewsCount: 110,
    prepTime: '4-6 min',
    calories: '390 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=600&q=80',
    description: 'Herb-crusted stretchy mozzarella sticks fried to golden crispness, served with warm marinara dipping sauce.',
    availableCustomizations: {
      addOns: [
        { id: 'addon-marinara', name: 'Extra Marinara Sauce', price: 0.50 },
        { id: 'addon-garlicdip', name: 'Garlic Herb Aioli', price: 0.60 },
      ],
    },
  },
  {
    id: 's3',
    name: 'Chicken Tenders & Honey Mustard (4 pcs)',
    category: 'snacks',
    price: 5.25,
    rating: 4.9,
    reviewsCount: 180,
    prepTime: '6 min',
    calories: '440 kcal',
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    description: 'Buttermilk soaked, hand-breaded crispy chicken breast tenders seasoned with paprika and sea salt, served with tangy honey mustard.',
    isPopular: true,
    availableCustomizations: {
      addOns: [
        { id: 'addon-bbq', name: 'Smoky BBQ Sauce', price: 0.40 },
        { id: 'addon-tenders-fries', name: 'Add Side Small Fries', price: 1.50 },
      ],
    },
  },

  // BEVERAGES
  {
    id: 'b1',
    name: 'Iced Caramel Macchiato',
    category: 'beverages',
    price: 3.75,
    rating: 4.9,
    reviewsCount: 220,
    prepTime: '2-3 min',
    calories: '180 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    description: 'Freshly pulled double espresso shot poured over velvety whole milk, vanilla syrup, ice, and finished with rich buttery caramel drizzle.',
    isPopular: true,
    availableCustomizations: {
      sizes: [
        { name: 'Regular (12oz)', priceMultiplier: 1.0 },
        { name: 'Large (16oz)', priceMultiplier: 1.25 },
      ],
      addOns: [
        { id: 'addon-oatmilk', name: 'Substitute Oat Milk', price: 0.50 },
        { id: 'addon-extraespresso', name: 'Extra Espresso Shot', price: 0.75 },
      ],
    },
  },
  {
    id: 'b2',
    name: 'Fresh Mango Mint Lemonade',
    category: 'beverages',
    price: 2.99,
    rating: 4.7,
    reviewsCount: 88,
    prepTime: '2 min',
    calories: '120 kcal',
    dietary: 'vegan',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Cold-pressed Alphonso mango nectar shaken with freshly squeezed lemon juice, crushed garden mint, and crushed ice.',
    availableCustomizations: {
      sizes: [
        { name: 'Regular (12oz)', priceMultiplier: 1.0 },
        { name: 'Large (16oz)', priceMultiplier: 1.3 },
      ],
      addOns: [
        { id: 'addon-chia', name: 'Add Chia Seeds', price: 0.35 },
      ],
    },
  },
  {
    id: 'b3',
    name: 'Classic Hot Chocolate with Marshmallows',
    category: 'beverages',
    price: 3.25,
    rating: 4.8,
    reviewsCount: 75,
    prepTime: '3 min',
    calories: '240 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    description: 'Steamed milk infused with Belgian dark chocolate ganache, topped with fluffy mini marshmallows and cocoa dusting.',
  },

  // COMBOS
  {
    id: 'c1',
    name: 'Study Buddy Rush Combo',
    category: 'combos',
    price: 8.99,
    rating: 4.9,
    reviewsCount: 230,
    prepTime: '8 min',
    calories: '780 kcal',
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    description: 'Best seller! Includes Smash Burger + Seasoned Waffle Fries + Choice of Iced Coffee or Lemonade. Save 25% compared to individual items.',
    isPopular: true,
    isSpecial: true,
    availableCustomizations: {
      spiceLevels: ['Mild', 'Medium', 'Extra Spicy'],
      addOns: [
        { id: 'combo-cookie', name: 'Add Warm Choco Chip Cookie', price: 1.00 },
      ],
    },
  },
  {
    id: 'c2',
    name: 'Green Power Lunch Combo',
    category: 'combos',
    price: 8.49,
    rating: 4.8,
    reviewsCount: 65,
    prepTime: '6 min',
    calories: '540 kcal',
    dietary: 'vegan',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Vegan Buddha Bowl + Fresh Mango Mint Lemonade + Organic Fruit Cup. Perfect energizing meal between lectures.',
    isSpecial: true,
  },

  // DESSERTS
  {
    id: 'd1',
    name: 'Warm Nutella Lava Brownie',
    category: 'desserts',
    price: 3.99,
    rating: 4.9,
    reviewsCount: 190,
    prepTime: '3-4 min',
    calories: '360 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    description: 'Decadent warm fudge brownie with molten Nutella core, served warm with a drizzle of dark chocolate sauce.',
    isPopular: true,
    availableCustomizations: {
      addOns: [
        { id: 'addon-icecream', name: 'Add Vanilla Ice Cream Scoop', price: 0.99 },
      ],
    },
  },
  {
    id: 'd2',
    name: 'Churros with Dulce de Leche Dip (3 pcs)',
    category: 'desserts',
    price: 3.49,
    rating: 4.7,
    reviewsCount: 78,
    prepTime: '4 min',
    calories: '310 kcal',
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    description: 'Golden Spanish churros rolled in cinnamon sugar, served with thick warm caramel dulce de leche.',
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-10492',
  name: 'Alex Johnson',
  email: 'alex.j@campus.edu',
  studentId: 'CS-2024-8841',
  campusRole: 'Student',
  walletBalance: 32.50,
  dietaryPreference: 'all',
  phone: '+1 (555) 382-9011',
};

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'QB-4912',
    items: [
      {
        id: 'cart-init-1',
        menuItem: MENU_ITEMS[0], // Smash Burger
        quantity: 1,
        itemTotal: 6.99,
        customization: { spiceLevel: 'Medium' }
      },
      {
        id: 'cart-init-2',
        menuItem: MENU_ITEMS[7], // Iced Caramel Macchiato
        quantity: 1,
        itemTotal: 3.75,
      }
    ],
    subtotal: 10.74,
    tax: 0.54,
    packagingFee: 0.50,
    discount: 1.07,
    total: 10.71,
    status: 'Ready for Pickup',
    pickupTime: 'Today at 10:45 AM (Break 1)',
    pickupCounter: 'Express Counter 2',
    createdAt: 'Today, 10:35 AM',
    paymentMethod: 'Campus Smartcard',
    specialInstructions: 'Extra napkins please!',
    qrCodeData: 'QUICKBITE-ORDER-4912-VERIFIED',
  },
  {
    id: 'ord-100',
    orderNumber: 'QB-3801',
    items: [
      {
        id: 'cart-init-3',
        menuItem: MENU_ITEMS[10], // Study Buddy Rush Combo
        quantity: 1,
        itemTotal: 8.99,
      }
    ],
    subtotal: 8.99,
    tax: 0.45,
    packagingFee: 0.50,
    discount: 0.00,
    total: 9.94,
    status: 'Completed',
    pickupTime: 'Yesterday at 1:15 PM',
    pickupCounter: 'Express Counter 1',
    createdAt: 'Yesterday, 1:02 PM',
    paymentMethod: 'UPI / GPay',
    qrCodeData: 'QUICKBITE-ORDER-3801-COMPLETED',
  }
];
