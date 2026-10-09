# QuickBite

Campus canteen ordering app: browse the menu between lectures, order ahead, pay, and pick up without queuing.

Built with **React Native**, **Expo SDK 57** and **TypeScript**, running on Android, iOS and web from one codebase.

> **Status:** early development. The app currently runs on local sample menu data with simulated payments and order updates. A real backend is planned.

## Features

- **Menu & search:** categories (Meals, Beverages, Snacks, Combos, Desserts), live search, veg-only filter and dietary tags.
- **Item customization:** portion sizes, spice levels, add-ons and notes, with live pricing.
- **Cart:** quantity controls, promo codes, 5% campus tax and Rs. 50 packaging fee. All prices in Sri Lankan Rupees (LKR).
- **Checkout:** pickup time slots around lecture breaks; pay with Campus Smartcard, LankaQR, card or cash on pickup.
- **Order tracking:** order number and QR pickup ticket, assigned counter, and status updates (Placed → Preparing → Ready for Pickup → Completed).
- **Profile & wallet:** Campus Smartcard balance with top-up, order history and one-tap reorder.
- **Accounts:** Student and Faculty/Staff sign-in, or continue as a guest.

## Getting started

### Prerequisites

- Node.js 18 or later
- npm

### Install and run

```bash
git clone https://github.com/Pavithira-R/Quickbite.git
cd Quickbite
npm install
npx expo start
```

Then press `w` for the web browser, or scan the QR code with **Expo Go** on an Android or iOS device.

## Scripts

| Command                           | What it does                           |
| --------------------------------- | -------------------------------------- |
| `npm start`                       | Start the Expo dev server              |
| `npm run web`                     | Start and open in the browser          |
| `npm run android` / `npm run ios` | Start and open on a device or emulator |
| `npm test`                        | Run the Jest unit tests                |
| `npm run typecheck`               | Type-check the project with TypeScript |
| `npm run lint`                    | Lint with ESLint                       |
| `npm run format`                  | Format all files with Prettier         |

## Project structure

```
src/
  components/   Reusable UI (header, bottom navigation, menu cards, toast)
  context/      App-wide state: auth, cart, orders, navigation
  data/         Sample menu data
  screens/      One file per screen
  theme/        Colors, spacing and radius tokens
  types/        Shared TypeScript types
  utils/        Pure business logic (pricing, promos, validation, order status)
    __tests__/  Jest unit tests
```

Pricing, promo, validation and order-status rules live in `src/utils/cartLogic.ts` as pure functions, so the app and the tests use the same code.
