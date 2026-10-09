# QuickBite — Campus Food Ordering Mobile App

A cross-platform mobile application MVP built with **React Native**, **Expo SDK 57**, and **TypeScript** for the university canteen ordering case study.

## 📱 Features

- **Splash & Authentication:** Splash screen, Student/Staff role toggle, form validation, and 1-tap Guest Access.
- **Menu Catalog & Search:** Categorized menu (*Meals, Beverages, Snacks, Combos, Desserts*), live search filter, dietary tags (Veg/Vegan/Non-Veg), and flash announcements.
- **Item Customization:** Portion sizes, spice level customizer (*Mild, Medium, Extra Spicy*), add-ons checklist with real-time pricing, and chef notes.
- **Shopping Cart & State Management:** React Context API state, dynamic subtotal, all prices in Sri Lankan Rupees (Rs. / LKR), 5% campus tax, Rs. 50 packaging fee, coupon code engine (`STUDENT15` for 15% off, `FREEDRINK` / `BITE250` for Rs. 250 off), quantity modifications, and item removal.
- **Lecture Break Checkout:** Pickup time slot selection (Morning Break, Lunch Break, ASAP), multiple payment gateways (*Campus Smartcard*, *UPI*, *Credit/Debit Card*, *Cash*), and smartcard balance validation.
- **Order Confirmation & QR Ticket:** Generated Order ID (`#QB-XXXX`), assigned Express counter, verification QR code ticket, and pickup ETA.
- **Live Order Tracking:** Multi-stage lifecycle (*Placed → Preparing → Ready for Pickup → Completed*), live countdown timer, and interactive simulation controls.
- **User Profile & Wallet:** Student credentials, RFID Campus Wallet with top-up simulation modal (Rs. 500 – 5,000), and past order history with 1-click Reorder.
- **Part D QA Test Suite:** Built-in interactive test runner executing 6 verification test cases covering navigation, cart logic, form validation, state persistence, layout responsiveness, and order state transition.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Pavithira-R/Quickbite.git
cd Quickbite

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on Targets
- **Web Browser:** Press `w` or run `npx expo start --web`
- **Android / iOS Device:** Open **Expo Go** and scan the terminal QR code.
