/\*\*

- SHOPPING CART SYSTEM - ARCHITECTURE & USAGE GUIDE
-
- Production-ready hybrid cart system for e-commerce platform
- Supports both guest (localStorage) and authenticated users (server)
  \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- SYSTEM ARCHITECTURE
- ═══════════════════════════════════════════════════════════════
-
- Cart System Components:
- ┌─────────────────────────────────────────────────────────────┐
- │ USER INTERFACE LAYER │
- │ CartDrawer, CartItem, AddToCartButton, CartSummary │
- └────────────────────┬────────────────────────────────────────┘
-                      │
- ┌────────────────────▼────────────────────────────────────────┐
- │ HOOKS LAYER │
- │ useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem│
- │ useCartDrawer, useCartPersistence │
- └────────────────────┬────────────────────────────────────────┘
-                      │
- ┌────────────────────▼────────────────────────────────────────┐
- │ REDUX STATE LAYER │
- │ cartSlice: State management with optimistic updates │
- │ Supports rollback on server action failure │
- └────────────────────┬────────────────────────────────────────┘
-                      │
- ┌────────────────────▼────────────────────────────────────────┐
- │ SERVER ACTIONS & API LAYER │
- │ addToCart, updateCartItem, removeCartItem, clearCart, │
- │ mergeCart - All with Zod validation │
- └────────────────────┬────────────────────────────────────────┘
-                      │
- ┌────────────────────▼────────────────────────────────────────┐
- │ PERSISTENCE LAYER │
- │ Guest: localStorage (client-side) │
- │ Authenticated: Database (server-side) │
- │ Sync: Automatic merge on login │
- └─────────────────────────────────────────────────────────────┘
  \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- FOLDER STRUCTURE
- ═══════════════════════════════════════════════════════════════
  \*/

// src/
// ├── lib/
// │ ├── types/
// │ │ └── cart.ts (Type definitions)
// │ ├── server/
// │ │ ├── actions/
// │ │ │ ├── cart.ts (Server actions)
// │ │ │ ├── auth.ts (Auth helpers)
// │ │ │ └── index.ts
// │ │ └── cart/
// │ │ ├── schemas.ts (Zod validation)
// │ │ ├── db.ts (Fake DB/Prisma stub)
// │ │ ├── utils.ts (Cart business logic)
// │ │ └── index.ts
// │ ├── client/
// │ │ ├── redux/
// │ │ │ ├── cartSlice.ts (Redux slice)
// │ │ │ ├── store.ts (Redux store)
// │ │ │ └── index.ts
// │ │ ├── utils/
// │ │ │ ├── cart.ts (localStorage, merge logic)
// │ │ │ └── index.ts
// │ │ └── providers/
// │ │ └── ReduxProvider.tsx (Redux wrapper)
// ├── hooks/
// │ └── cart/
// │ ├── useCart.ts
// │ ├── useAddToCart.ts
// │ ├── useUpdateCartItem.ts
// │ ├── useRemoveCartItem.ts
// │ ├── useCartDrawer.ts
// │ ├── useCartPersistence.ts
// │ └── index.ts
// ├── components/
// │ ├── ui/
// │ │ ├── sheet.tsx (shadcn/ui)
// │ │ ├── badge.tsx (shadcn/ui)
// │ │ └── scroll-area.tsx (shadcn/ui)
// │ └── cart/
// │ ├── CartDrawer.tsx
// │ ├── CartItem.tsx
// │ ├── CartSummary.tsx
// │ ├── EmptyCart.tsx
// │ ├── CartError.tsx
// │ ├── AddToCartButton.tsx
// │ └── index.ts

/\*\*

- ═══════════════════════════════════════════════════════════════
- USAGE EXAMPLES
- ═══════════════════════════════════════════════════════════════
  \*/

/\*\*

- 1.  SETUP - Wrap app with Redux Provider in root layout
-
- // src/app/layout.tsx
- import { ReduxProvider } from '@/lib/client/providers/ReduxProvider';
-
- export default function RootLayout({ children }) {
- return (
-     <html>
-       <body>
-         <ReduxProvider>
-           {children}
-         </ReduxProvider>
-       </body>
-     </html>
- );
- }
  \*/

/\*\*

- 2.  ADD TO CART BUTTON - Use on product cards/pages
-
- import { AddToCartButton } from '@/components/cart';
-
- export function ProductCard({ product }) {
- return (
-     <div>
-       <img src={product.image} />
-       <h2>{product.name}</h2>
-       <p>${product.price}</p>
-       <AddToCartButton
-         productId={product.id}
-         name={product.name}
-         priceSnapshot={product.price}
-         image={product.image}
-         stock={product.stock}
-         variants={product.variants}
-         onSuccess={() => console.log('Added to cart!')}
-       />
-     </div>
- );
- }
  \*/

/\*\*

- 3.  CART DRAWER - Display cart in header/sidebar
-
- 'use client';
- import { useCartDrawer } from '@/hooks/cart';
- import { CartDrawer } from '@/components/cart';
- import { Button } from '@/components/ui/button';
-
- export function Header() {
- const { isOpen, open, close } = useCartDrawer();
-
- return (
-     <>
-       <Button onClick={open}>Cart</Button>
-       <CartDrawer isOpen={isOpen} onClose={close} />
-     </>
- );
- }
  \*/

/\*\*

- 4.  CUSTOM CART OPERATIONS - Direct hook usage
-
- 'use client';
- import { useCart, useAddToCart, useRemoveCartItem } from '@/hooks/cart';
-
- export function CartManager() {
- const { items, isEmpty, totalPrice } = useCart();
- const { addItem } = useAddToCart();
- const { removeItem } = useRemoveCartItem();
-
- return (
-     <div>
-       <p>Total: ${totalPrice}</p>
-       <button onClick={() => addItem({...})}>Add</button>
-       {items.map(item => (
-         <div key={item.id}>
-           {item.name}
-           <button onClick={() => removeItem(item.id)}>Remove</button>
-         </div>
-       ))}
-     </div>
- );
- }
  \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- DATA FLOW & STATE MANAGEMENT
- ═══════════════════════════════════════════════════════════════
  \*/

/\*\*

- GUEST USER FLOW:
- 1.  User adds item to cart
- 2.  Optimistic update in Redux (instant UI feedback)
- 3.  If authenticated: sent to server, saved to database
- 4.  If guest: saved to localStorage via useCartSync hook
- 5.  On page reload: loaded from localStorage via useCartInitialization
-
- AUTHENTICATED USER FLOW:
- 1.  User adds item to cart
- 2.  Optimistic update in Redux (instant UI feedback)
- 3.  Server action validates stock and saves to database
- 4.  Redux state confirmed with server response
- 5.  localStorage also synced (useCartSync hook)
-
- LOGIN FLOW (merge carts):
- 1.  Guest user logs in
- 2.  System calls mergeCart action
- 3.  Server merges guest cart (from payload) with user's server cart
- 4.  Rules:
- - Same product+variant: sum quantities (respect stock)
- - Guest only: add to user cart
- - User only: keep existing
- 5.  Redux state updated with merged cart
- 6.  localStorage cleared after successful merge
      \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- KEY FEATURES & EDGE CASES HANDLED
- ═══════════════════════════════════════════════════════════════
  \*/

/\*\*

- OPTIMISTIC UPDATES:
- ✓ Immediate UI feedback (no loading state for add/update/remove)
- ✓ Previous state saved for rollback on error
- ✓ Server action confirms changes
- ✓ Automatic rollback if server action fails
-
- STOCK VALIDATION:
- ✓ Quantity cannot exceed available stock
- ✓ Quantity must be positive integer
- ✓ Stock checked before adding/updating
- ✓ UI prevents exceeding max quantity
- ✓ Error message if stock exceeded
-
- PRICE SNAPSHOTS:
- ✓ Price captured at time of adding (immutable)
- ✓ Prevents price changes from affecting cart total
- ✓ Useful for dynamic pricing scenarios
-
- VARIANTS SUPPORT:
- ✓ Multiple variant types (size, color, etc.)
- ✓ Unique variantId prevents duplicate items
- ✓ Same product different variants = different cart items
- ✓ Displayed as badges in cart item
-
- PERSISTENCE:
- ✓ Guest: localStorage auto-sync via Redux subscription
- ✓ Authenticated: Server database persistence
- ✓ Auto-merge on login (guest → authenticated)
- ✓ Auto-recovery from corrupt localStorage data
-
- DEBOUNCING:
- ✓ Quantity updates debounced (500ms default)
- ✓ Prevents rapid API calls during quick changes
- ✓ Improves performance and reduces server load
-
- ERROR HANDLING:
- ✓ Zod validation on all inputs
- ✓ Server action error responses
- ✓ Redux state rollback on failure
- ✓ User-friendly error messages
- ✓ Retry functionality in UI
-
- LOADING STATES:
- ✓ Per-operation loading indicators (add, update, remove)
- ✓ Overall cart loading state
- ✓ Skeleton state for initial load
- ✓ Prevents double-submission
  \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- INTEGRATION WITH NEXT.JS
- ═══════════════════════════════════════════════════════════════
  \*/

/\*\*

- SERVER ACTIONS:
- - All cart operations are Server Actions (no REST API needed)
- - Use 'use server' directive
- - Automatic request deduplication
- - Works with form submissions
- - Can be called from components with useTransition
-
- CLIENT COMPONENTS:
- - All cart UI and hooks marked with 'use client'
- - Redux runs on client-side only
- - Can import server actions directly
- - Composition: Server → Client components works fine
-
- MIDDLEWARE (optional):
- - Could add auth middleware to protect server actions
- - Rate limiting on cart operations
- - Analytics logging for cart events
-
- CACHING:
- - Server cart data: Invalidate on mutations
- - Product data: Could be revalidated on schedule
- - localStorage: Client-managed, no server cache needed
    \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- PRODUCTION CONSIDERATIONS
- ═══════════════════════════════════════════════════════════════
  \*/

/\*\*

- AUTHENTICATION:
- - Integrate with real auth provider (NextAuth, Clerk, etc.)
- - Update getCurrentUserSession() in src/lib/server/actions/auth.ts
- - Verify user permissions in server actions
-
- DATABASE:
- - Replace fake DB in src/lib/server/cart/db.ts with Prisma queries
- - Example schema in documentation
- - Add database indexes on userId, productId
-
- VALIDATION:
- - Keep Zod schemas as is (well-designed)
- - Consider adding rate limiting
- - Add CSRF protection if using form submissions
-
- ERROR TRACKING:
- - Add error logging (Sentry, LogRocket, etc.)
- - Monitor cart-specific errors
- - Set up alerts for critical failures
-
- PERFORMANCE:
- - Monitor Redux store size (memoization already in place)
- - Consider pagination for very large carts (edge case)
- - Use React DevTools Profiler to identify bottlenecks
-
- SECURITY:
- - Validate user owns cart items (server-side)
- - Prevent price manipulation
- - Rate limit cart operations per user
- - Sanitize user input (Zod handles this)
-
- ANALYTICS:
- - Track add-to-cart events
- - Monitor cart abandonment
- - Measure conversion rates
- - Log variant preferences
    \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- API REFERENCE
- ═══════════════════════════════════════════════════════════════
  \*/

/\*\*

- HOOKS
- ─────────────────────────────────────────────────────────────
- useCart()
- Returns: { items, error, isLoading, isEmpty, itemCount, totalPrice, totals, clearError }
-
- useAddToCart(options?)
- Returns: { addItem, isLoading }
- addItem(payload: AddToCartPayload) → Promise<{ success, data?, error? }>
-
- useUpdateCartItem(options?)
- Returns: { updateQuantity, cancelPending }
- updateQuantity(cartItemId: string, quantity: number) → Promise
-
- useRemoveCartItem(options?)
- Returns: { removeItem, isLoading }
- removeItem(cartItemId: string) → Promise<{ success, error? }>
-
- useCartDrawer(initialOpen?)
- Returns: { isOpen, open, close, toggle }
-
- useCartPersistence()
- Side effect: Initializes and syncs cart with localStorage
  \*/

/\*\*

- SERVER ACTIONS
- ─────────────────────────────────────────────────────────────
- addToCart(input: AddToCartPayload)
- → CartActionResponse<CartItem>
-
- updateCartItem(input: UpdateCartItemPayload)
- → CartActionResponse<CartItem>
-
- removeCartItem(input: RemoveCartItemPayload)
- → CartActionResponse<boolean>
-
- clearCart(input?: ClearCartPayload)
- → CartActionResponse<boolean>
-
- mergeCart(input: MergeCartPayload)
- → CartActionResponse<Cart>
-
- getUserServerCart()
- → CartActionResponse<Cart>
  \*/

/\*\*

- TYPES
- ─────────────────────────────────────────────────────────────
- CartItem: { id, productId, name, priceSnapshot, quantity, image, stock, variants?, variantId? }
- Cart: { items: CartItem[], lastUpdated?: number }
- AddToCartPayload: { productId, name, priceSnapshot, quantity, image, stock, variants?, variantId? }
- UpdateCartItemPayload: { cartItemId, quantity }
- RemoveCartItemPayload: { cartItemId }
- CartActionResponse<T>: { success, data?, error?: { code, message } }
  \*/

export {};
