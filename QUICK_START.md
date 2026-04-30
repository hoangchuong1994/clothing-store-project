/\*\*

- QUICK START GUIDE
- Get the cart system up and running in 5 minutes
  \*/

# Quick Start Guide - Shopping Cart System

## ⚡ Setup in 5 Minutes

### Step 1: Wrap Your App with Redux Provider

**File**: `src/app/layout.tsx`

```tsx
import { ReduxProvider } from '@/lib/client/providers/ReduxProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
```

### Step 2: Add Cart Button to Header

**File**: `src/components/header/CartButton.tsx`

```tsx
'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartDrawer } from '@/hooks/cart';
import { useCart } from '@/hooks/cart';
import { CartDrawer } from '@/components/cart';
import { Badge } from '@/components/ui/badge';

export function CartButton() {
  const { isOpen, open, close } = useCartDrawer();
  const { itemCount } = useCart();

  return (
    <>
      <button onClick={open} className="relative p-2" aria-label="Shopping cart">
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0">
            {itemCount}
          </Badge>
        )}
      </button>

      <CartDrawer isOpen={isOpen} onClose={close} />
    </>
  );
}
```

### Step 3: Add to Cart Button on Product Cards

**File**: `src/components/ProductCard.tsx`

```tsx
'use client';

import { AddToCartButton } from '@/components/cart';
import { Product } from '@/lib/types/cart';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />

      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="mt-2 text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>

        <AddToCartButton
          productId={product.id}
          name={product.name}
          priceSnapshot={product.price}
          image={product.image}
          stock={product.stock}
          className="mt-4 w-full"
        />
      </div>
    </div>
  );
}
```

### Step 4: Done! 🎉

You now have a fully functional shopping cart with:

- ✅ Add to cart
- ✅ Cart drawer
- ✅ Quantity controls
- ✅ localStorage persistence
- ✅ Optimistic updates
- ✅ Error handling

---

## 📚 Common Tasks

### Get Cart Totals

```tsx
import { useCart } from '@/hooks/cart';

export function OrderSummary() {
  const { totalPrice, itemCount } = useCart();

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
```

### Handle Add to Cart Success

```tsx
import { AddToCartButton } from '@/components/cart';

<AddToCartButton
  productId={product.id}
  name={product.name}
  priceSnapshot={product.price}
  image={product.image}
  stock={product.stock}
  onSuccess={() => {
    // Show toast notification
    console.log('Added to cart!');
  }}
  onError={(error) => {
    // Show error message
    console.error(error);
  }}
/>;
```

### Display Cart Items

```tsx
import { useCart } from '@/hooks/cart';
import { CartItem } from '@/components/cart';

export function CartPage() {
  const { items, isEmpty } = useCart();

  if (isEmpty) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Access Cart State Directly (Advanced)

```tsx
import { useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartItemCount,
  selectCartIsEmpty,
  selectCartError,
} from '@/lib/client/redux/cartSlice';

export function MyComponent() {
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const itemCount = useSelector(selectCartItemCount);
  const isEmpty = useSelector(selectCartIsEmpty);
  const error = useSelector(selectCartError);

  // Use state...
}
```

---

## 🔧 Configuration

### Change Tax Rate

Edit `src/components/cart/CartDrawer.tsx`:

```tsx
const tax = Math.round(subtotal * 0.08 * 100) / 100; // Change 0.08 to your rate
```

### Change Debounce Delay

Edit `src/hooks/cart/useUpdateCartItem.ts`:

```tsx
export function useUpdateCartItem(options?: UseUpdateCartItemOptions) {
  // ...
  debounceMs || 500, // Change 500 to your preferred delay
}
```

### Customize Empty Cart Message

Edit `src/components/cart/EmptyCart.tsx`:

```tsx
<h3 className="text-lg font-semibold text-gray-900">
  Your cart is empty {/* Change this message */}
</h3>
```

---

## 🚀 Production Checklist

Before going live:

- [ ] **Authentication**: Update `src/lib/server/actions/auth.ts` with real auth
- [ ] **Database**: Replace `src/lib/server/cart/db.ts` with Prisma queries
- [ ] **Toast Notifications**: Add toast library (e.g., sonner, react-toastify)
- [ ] **Error Tracking**: Add Sentry or similar
- [ ] **Testing**: Test cart merge on login
- [ ] **Analytics**: Add cart event tracking
- [ ] **Styling**: Customize colors/fonts to match your brand
- [ ] **Images**: Use real product images
- [ ] **Performance**: Test with large carts
- [ ] **Security**: Review auth and validation

---

## 📖 Learn More

- **Complete API Reference**: See `CART_SYSTEM_GUIDE.md`
- **Integration Examples**: See `INTEGRATION_EXAMPLES.md`
- **Database Setup**: See `PRISMA_SCHEMA.md`
- **Hook Documentation**: See `src/hooks/cart/index.ts`
- **Component Documentation**: See `src/components/cart/index.ts`

---

## ❓ Troubleshooting

### Cart not persisting?

- Check browser console for localStorage errors
- Ensure `useCartPersistence()` is being called (it's in ReduxProvider)
- Verify localStorage is enabled

### Optimistic updates not rolling back?

- Check console for server action errors
- Verify Zod validation schemas are correct
- Check `src/lib/server/cart/db.ts` for database errors

### Redux state not syncing?

- Verify `ReduxProvider` wraps the entire app
- Check Redux DevTools to see state changes
- Ensure hooks are called in client components (use 'use client')

### Stock validation failing?

- Verify product stock in fake DB
- Check `checkStock()` function in `src/lib/server/cart/db.ts`
- Ensure quantity validation in schemas

---

## 💡 Tips & Best Practices

1. **Always use hooks** - Don't access Redux directly unless necessary
2. **Handle errors** - Use `onError` callback in `useAddToCart`, etc.
3. **Show loading states** - Components have `isLoading` prop
4. **Test variants** - Try products with size/color variants
5. **Test edge cases** - Out of stock, invalid quantities, etc.
6. **Monitor performance** - Use React DevTools Profiler
7. **Add analytics** - Track add-to-cart, remove, and checkout events
8. **Secure prices** - Price snapshots prevent manipulation

---

## 🎯 Next Features to Add

1. **Checkout Page** - Integrate with payment processor
2. **Wishlist** - Save favorite items
3. **Quantity Discounts** - Buy more, save more
4. **Coupon Codes** - Apply discount codes
5. **Gift Cards** - Sell gift cards
6. **Order History** - Show past orders
7. **Saved Addresses** - Quick address selection
8. **Multiple Payment Methods** - Credit card, PayPal, Apple Pay, etc.

---

**You're all set!** 🎉 The shopping cart system is ready to use.
