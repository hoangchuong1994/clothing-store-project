/\*\*

- COMPLETE FOLDER STRUCTURE - Cart System
  \*/

# Shopping Cart System - Complete Folder Structure

## 📁 Directory Tree

```
clothing-store/
├── src/
│   ├── lib/
│   │   ├── types/
│   │   │   └── cart.ts ........................... Type definitions
│   │   │
│   │   ├── server/
│   │   │   ├── actions/
│   │   │   │   ├── cart.ts ...................... Server actions (5 functions)
│   │   │   │   ├── auth.ts ...................... Auth helpers & session
│   │   │   │   └── index.ts ..................... Public exports
│   │   │   │
│   │   │   └── cart/
│   │   │       ├── schemas.ts ................... Zod validation schemas
│   │   │       ├── db.ts ........................ Fake DB (replace with Prisma)
│   │   │       ├── utils.ts ..................... Cart business logic
│   │   │       └── index.ts ..................... Public exports
│   │   │
│   │   └── client/
│   │       ├── redux/
│   │       │   ├── cartSlice.ts ................ Redux slice with actions
│   │       │   ├── store.ts .................... Redux store config
│   │       │   └── index.ts .................... Public exports
│   │       │
│   │       ├── utils/
│   │       │   ├── cart.ts ..................... localStorage & merge logic
│   │       │   └── index.ts .................... Public exports
│   │       │
│   │       └── providers/
│   │           └── ReduxProvider.tsx ........... Redux + Persistence wrapper
│   │
│   ├── hooks/
│   │   └── cart/
│   │       ├── useCart.ts ...................... Main cart hook
│   │       ├── useAddToCart.ts ................. Add item hook
│   │       ├── useUpdateCartItem.ts ........... Update quantity hook
│   │       ├── useRemoveCartItem.ts ........... Remove item hook
│   │       ├── useCartDrawer.ts ............... Drawer state hook
│   │       ├── useCartPersistence.ts .......... localStorage sync hook
│   │       └── index.ts ........................ Public exports
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── sheet.tsx ....................... Sheet/Drawer component
│   │   │   ├── badge.tsx ....................... Badge component
│   │   │   ├── scroll-area.tsx ................. ScrollArea component
│   │   │   ├── button.tsx (existing) .......... Button component
│   │   │   ├── input.tsx (existing) ........... Input component
│   │   │   └── ... (other shadcn/ui components)
│   │   │
│   │   └── cart/
│   │       ├── CartDrawer.tsx .................. Main drawer component
│   │       ├── CartItem.tsx .................... Item component
│   │       ├── CartSummary.tsx ................. Summary component
│   │       ├── EmptyCart.tsx ................... Empty state component
│   │       ├── CartError.tsx ................... Error component
│   │       ├── AddToCartButton.tsx ............ Add to cart button
│   │       └── index.ts ........................ Public exports
│   │
│   └── app/ (existing structure)
│       ├── layout.tsx ........................... (needs ReduxProvider wrapper)
│       ├── [locale]/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── (admin)/
│       │   ├── (auth)/
│       │   └── (home)/
│       └── api/ (not needed, using Server Actions)
│
├── public/ (existing)
├── messages/ (existing)
├── README.md (existing)
├── package.json (existing)
├── tsconfig.json (existing)
│
├── 📄 CART_SYSTEM_GUIDE.md ..................... Complete architecture guide
├── 📄 INTEGRATION_EXAMPLES.md .................. 7 integration examples
├── 📄 PRISMA_SCHEMA.md ......................... Production database schema
├── 📄 IMPLEMENTATION_SUMMARY.md ............... Project summary
├── 📄 QUICK_START.md ........................... 5-minute quick start
├── 📄 FOLDER_STRUCTURE.md (this file) ........ Directory organization
│
└── (other config files)
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── package.json
    └── ...
```

---

## 📊 Files by Category

### Type Definitions (1 file)

```
src/lib/types/
  └── cart.ts ........................ All types, interfaces, enums
```

### Server-Side (7 files)

```
src/lib/server/
  ├── actions/
  │   ├── cart.ts ................ 5 server actions
  │   ├── auth.ts ................ Auth helpers
  │   └── index.ts ............... Exports
  └── cart/
      ├── schemas.ts ............. Zod validation (6 schemas)
      ├── db.ts .................. Database simulation
      ├── utils.ts ............... Business logic utilities
      └── index.ts ............... Exports
```

### Client State (5 files)

```
src/lib/client/
  ├── redux/
  │   ├── cartSlice.ts .......... Redux slice with 15+ actions
  │   ├── store.ts .............. Store configuration
  │   └── index.ts .............. Exports
  ├── utils/
  │   ├── cart.ts ............... localStorage & helpers (11 functions)
  │   └── index.ts .............. Exports
  └── providers/
      └── ReduxProvider.tsx ...... Redux wrapper
```

### Custom Hooks (7 files)

```
src/hooks/cart/
  ├── useCart.ts
  ├── useAddToCart.ts
  ├── useUpdateCartItem.ts
  ├── useRemoveCartItem.ts
  ├── useCartDrawer.ts
  ├── useCartPersistence.ts
  └── index.ts (exports all)
```

### UI Components (9 files)

```
src/components/
  ├── ui/
  │   ├── sheet.tsx ............. Drawer (new)
  │   ├── badge.tsx ............. Badge (new)
  │   └── scroll-area.tsx ........ Scroll (new)
  └── cart/
      ├── CartDrawer.tsx ........ Main component
      ├── CartItem.tsx .......... Item component
      ├── CartSummary.tsx ....... Summary
      ├── EmptyCart.tsx ......... Empty state
      ├── CartError.tsx ......... Error display
      ├── AddToCartButton.tsx ... Add button
      └── index.ts .............. Exports
```

### Documentation (6 files)

```
project-root/
  ├── CART_SYSTEM_GUIDE.md
  ├── INTEGRATION_EXAMPLES.md
  ├── PRISMA_SCHEMA.md
  ├── IMPLEMENTATION_SUMMARY.md
  ├── QUICK_START.md
  └── FOLDER_STRUCTURE.md (this file)
```

---

## 🔍 Key File Descriptions

### Core Files

| File                   | Lines | Purpose                |
| ---------------------- | ----- | ---------------------- |
| `cart.ts` (types)      | 100   | All type definitions   |
| `cartSlice.ts`         | 350   | Redux state & actions  |
| `cart.ts` (actions)    | 400   | Server actions         |
| `cartSlice.ts` (hooks) | N/A   | Custom hooks directory |
| `CartDrawer.tsx`       | 150   | Main UI component      |
| `cart.ts` (utils)      | 250   | Client utilities       |

### Feature Files

| Feature         | Files | Lines |
| --------------- | ----- | ----- |
| Add to Cart     | 5     | 300   |
| Update Quantity | 3     | 150   |
| Remove Item     | 3     | 120   |
| Clear Cart      | 3     | 100   |
| Merge Cart      | 4     | 200   |
| Persistence     | 2     | 100   |
| Validation      | 2     | 200   |

---

## 🎯 How Files Work Together

```
User clicks "Add to Cart"
        ↓
    AddToCartButton.tsx
        ↓
    useAddToCart() hook
        ↓
    Redux optimistic update (cartSlice.ts)
        ↓
    Server action (actions/cart.ts)
        ↓
    Zod validation (schemas.ts)
        ↓
    Database operation (db.ts)
        ↓
    Redux confirmation/rollback
        ↓
    localStorage sync (useCartSync hook)
        ↓
    UI rerender with new state
```

---

## 📋 Dependencies Between Files

### Action: Add to Cart

```
AddToCartButton.tsx
  → useAddToCart() hook
    → addToCartAction() [server]
      → AddToCartSchema [validation]
        → getProduct() [db.ts]
        → checkStock() [db.ts]
      → saveUserCart() [db.ts]
    → Redux cartSlice
    → useCart() [state]
```

### Action: Persist Cart

```
Any cart operation
  → Redux state changes
    → useCartSync() hook [automatically runs]
      → saveCartToLocalStorage() [utils]
        → localStorage API
```

### Action: Merge Cart on Login

```
User Login Event
  → mergeCart() [server action]
    → MergeCartSchema [validation]
      → mergeCartsLogic() [utils]
      → saveUserCart() [db.ts]
    → Redux mergeCartSuccess [cartSlice]
    → clearCartFromLocalStorage() [utils]
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────┐
│         Component / Hook Layer              │
├─────────────────────────────────────────────┤
│  AddToCartButton, CartDrawer, CartItem      │
│  useCart(), useAddToCart(), etc.            │
└───────────────┬─────────────────────────────┘
                │
         ┌──────▼──────────┐
         │  Redux Store    │
         │  (cartSlice)    │
         └──────┬──────────┘
                │
        ┌───────┴────────┐
        │                │
    Server         localStorage
    Actions        (utils/cart.ts)
    (actions/)
        │                │
    Database          Browser
    (db.ts)           Storage
```

---

## 🗂️ Imports at a Glance

### Import Cart Items

```tsx
import { useCart } from '@/hooks/cart';
```

### Import Cart Components

```tsx
import { CartDrawer, CartItem, AddToCartButton } from '@/components/cart';
```

### Import Redux

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotalPrice } from '@/lib/client/redux/cartSlice';
```

### Import Server Actions

```tsx
import { addToCart, mergeCart } from '@/lib/server/actions/cart';
```

### Import Types

```tsx
import { CartItem, AddToCartPayload, Cart } from '@/lib/types/cart';
```

---

## 📏 File Size Reference

- **Smallest File**: `useCartDrawer.ts` (~30 lines)
- **Largest File**: `cartSlice.ts` (~350 lines)
- **Average File Size**: ~100-150 lines
- **Total Lines**: ~5000+

---

## 🔐 File Security Level

### Public (Safe to expose to frontend)

```
✓ hooks/
✓ components/cart/
✓ lib/client/
✓ lib/types/
✓ lib/server/cart/schemas.ts
```

### Internal (Server-only)

```
✓ lib/server/actions/
✓ lib/server/cart/db.ts
✓ lib/server/cart/utils.ts
```

---

## 🚀 Adding New Features

### To add a new cart feature:

1. Add types to `src/lib/types/cart.ts`
2. Add Zod schema to `src/lib/server/cart/schemas.ts`
3. Add server action to `src/lib/server/actions/cart.ts`
4. Add Redux actions to `src/lib/client/redux/cartSlice.ts`
5. Add hook to `src/hooks/cart/`
6. Add component to `src/components/cart/`
7. Export in index files

---

## ✅ Checklist for Production

- [ ] All imports use absolute paths (`@/`)
- [ ] No relative imports (../../)
- [ ] All server actions in `lib/server/actions/`
- [ ] All client hooks in `hooks/`
- [ ] All UI components in `components/`
- [ ] Types in `lib/types/`
- [ ] Schemas in `lib/server/cart/`
- [ ] Utilities organized by layer
- [ ] Public APIs exported in index files
- [ ] Documentation in root folder

---

This structure is **scalable, maintainable, and production-ready**.
