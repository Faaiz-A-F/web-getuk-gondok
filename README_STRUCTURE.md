# Web Getuk Gondok - Project Structure

## Folder Organization

### `src/app/` - Pages & Routing (Next.js App Router)
- **`(shop)/`** - Main shop pages with layout
  - `page.tsx` - Home/landing page
  - `products/` - Product listing & details
  - `cart/` - Shopping cart
  - `checkout/` - Checkout flow
  
- **`(auth)/`** - Authentication pages with layout
  - `login/` - Login page
  - `register/` - Registration page
  
- **`admin/`** - Admin dashboard with sidebar
  - `products/` - Product management
  - `orders/` - Order management
  - `analytics/` - Analytics dashboard
  
- **`api/`** - Backend API routes
  - `products/` - Product endpoints
  - `orders/` - Order endpoints
  - `auth/` - Authentication endpoints

### `src/components/` - Reusable Components
- **`common/`** - Generic UI components (Button, Card, Modal, etc.)
- **`layout/`** - Layout components (Header, Footer, Sidebar)
- **`product/`** - Product-specific components (ProductCard, ProductGrid, etc.)
- **`cart/`** - Cart-specific components (CartItem, CartSummary)
- **`admin/`** - Admin-specific components

### `src/assets/` - Static Files
- **`images/`** - Product images, banners
- **`icons/`** - SVG icons
- **`logos/`** - Brand logos

### `src/lib/` - Utility Functions & Hooks
- **`api/`** - API client functions (fetch helpers)
- **`hooks/`** - Custom React hooks (useCart, useAuth, useFetch)
- **`utils/`** - Helper functions (formatPrice, validation, etc.)

### `src/types/` - TypeScript Definitions
- Global type definitions for Product, Order, User, CartItem, etc.

### `src/context/` - Context API
- State management contexts (CartContext, AuthContext, etc.)

### `src/styles/` - Additional Styles
- Global styles and CSS variables

## Key Next.js Concepts

1. **Route Groups** `(name)` - Organize routes without affecting URL
2. **Dynamic Routes** `[id]` - Catch dynamic segments
3. **API Routes** `app/api/` - Backend endpoints
4. **Layouts** - Shared UI per route segment
5. **Server vs Client Components** - Use 'use client' directive for interactivity

## Getting Started

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build for production: `npm run build`
4. Start production: `npm start`

## FNB Ecommerce Features to Implement

- [ ] Product catalog with categories
- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Order management
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Order tracking
- [ ] Review system
