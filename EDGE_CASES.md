/\*\*

- EDGE CASES & PRODUCTION CONSIDERATIONS
- Comprehensive guide for handling real-world scenarios
  \*/

# Edge Cases & Production Considerations

## 🛡️ Handled Edge Cases

### Stock Management

- ✅ **Out of Stock**: UI prevents adding out-of-stock items
- ✅ **Quantity Exceeds Stock**: Quantity capped at available stock
- ✅ **Stock Decreased**: Server validates before accepting update
- ✅ **Race Conditions**: Stock checked server-side on every operation
- ✅ **Negative Stock**: Cannot go below zero (schema validation)
- ✅ **Zero Stock**: UI shows "Out of Stock" badge

**Implementation:**

```tsx
// In addToCart server action
const stockCheck = await checkStock(validatedInput.productId, validatedInput.quantity);
if (!stockCheck.isAvailable) {
  return { success: false, error: { code: 'INSUFFICIENT_STOCK', ... } };
}

// In CartItem component
const isMaxQuantity = item.quantity >= item.stock;
<button disabled={isMaxQuantity}>Add More</button>
```

---

### Data Corruption & Recovery

- ✅ **Invalid localStorage**: Graceful fallback to empty cart
- ✅ **Missing Cart Data**: Initialize empty cart automatically
- ✅ **Corrupted Items**: Validate and sanitize on load
- ✅ **Inconsistent State**: Redux as single source of truth
- ✅ **Duplicate IDs**: UUID generation prevents collisions

**Implementation:**

```tsx
// In loadCartFromLocalStorage
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const parsed = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed : [];
} catch (error) {
  console.error('Failed to load cart from localStorage:', error);
  return []; // Fallback to empty
}

// In sanitizeCart
export function sanitizeCart(cart: Cart): Cart {
  return {
    ...cart,
    items: cart.items.filter((item) => {
      const validation = validateCartItem(item);
      return validation.isValid;
    }),
  };
}
```

---

### Price Manipulation Prevention

- ✅ **Price Immutability**: Snapshot at add-to-cart time
- ✅ **Price Changes**: User pays original price
- ✅ **Dynamic Pricing**: Captured on cart addition
- ✅ **No Price Override**: Server source of truth
- ✅ **Price Audit**: Snapshots enable audit trail

**Implementation:**

```tsx
// Price snapshot stored with item
interface CartItem {
  priceSnapshot: number; // Captured at time of adding
  // Later price changes don't affect this item's price
}

// Server validates price at checkout
const calculatedTotal = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
```

---

### Duplicate Item Prevention

- ✅ **Same Product, Same Variant**: Quantity increased instead
- ✅ **Same Product, Different Variant**: Separate items
- ✅ **Variant ID Uniqueness**: variantId prevents duplicates
- ✅ **Variant Combination**: Each variant combo = unique item

**Implementation:**

```tsx
// Unique key for product+variant combination
const findCartItemByProduct = (cart: Cart, productId: string, variantId?: string) => {
  return cart.items.find(
    (item) =>
      item.productId === productId && (variantId ? item.variantId === variantId : !item.variantId),
  );
};

// In addToCart
if (existingItem) {
  // Update quantity, don't duplicate
  existingItem.quantity = Math.min(existingItem.quantity + quantity, stock);
} else {
  // Only add if truly different
  cart.items.push(newItem);
}
```

---

### Authentication & Guest State

- ✅ **Guest User Cart**: localStorage only
- ✅ **Authenticated User**: Server storage + localStorage
- ✅ **Logout**: Cart still accessible as guest cart
- ✅ **Session Timeout**: Cart persists in localStorage
- ✅ **Multi-Tab Sync**: localStorage events (optional)

**Implementation:**

```tsx
// In server actions, check user session
const session = await getCurrentUserSession();

if (session.isAuthenticated && session.userId) {
  // Save to server
  await saveUserCart(session.userId, cart);
} else {
  // Client-side only (localStorage handled by useCartSync)
}
```

---

### Cart Merge on Login

- ✅ **Smart Merging**: Same product + quantity = sum
- ✅ **Stock Respect**: Never exceed available stock
- ✅ **No Data Loss**: All items preserved
- ✅ **Price Integrity**: Most recent price used
- ✅ **Duplicate Prevention**: No duplicate items

**Implementation:**

```tsx
export function mergeCartsLogic(userCart: CartItem[], guestCart: CartItem[]): CartItem[] {
  const userCartMap = new Map(userCart.map((item) => [getKey(item), item]));
  const mergedItems: CartItem[] = [];
  const processedKeys = new Set<string>();

  // Merge guest items with user items
  for (const guestItem of guestCart) {
    const key = getKey(guestItem);
    const userItem = userCartMap.get(key);

    if (userItem) {
      // Same product: sum quantities
      const mergedQuantity = Math.min(userItem.quantity + guestItem.quantity, userItem.stock);
      mergedItems.push({
        ...userItem,
        quantity: mergedQuantity,
        priceSnapshot: guestItem.priceSnapshot, // Use newer price
      });
    } else {
      // New product: add it
      mergedItems.push(guestItem);
    }
    processedKeys.add(key);
  }

  // Keep user-only items
  for (const userItem of userCart) {
    if (!processedKeys.has(getKey(userItem))) {
      mergedItems.push(userItem);
    }
  }

  return mergedItems;
}
```

---

### Network & Server Errors

- ✅ **Connection Timeout**: Rollback with error
- ✅ **Server 500 Error**: Automatic rollback
- ✅ **Request Failure**: Cart state reverted
- ✅ **Retry Logic**: User can try again
- ✅ **Error Messages**: Clear, user-friendly

**Implementation:**

```tsx
// In useAddToCart hook
try {
  dispatch(addToCartOptimistic(item)); // Immediate feedback
  const response = await addToCartAction(payload); // Server

  if (response.success) {
    dispatch(addToCartSuccess(response.data));
  } else {
    dispatch(addToCartError(response.error?.message)); // Rollback
  }
} catch (error) {
  dispatch(addToCartError(error.message)); // Rollback
}
```

---

### Concurrent Operations

- ✅ **Simultaneous Updates**: Last one wins (server truth)
- ✅ **Race Conditions**: Server actions are atomic
- ✅ **Double Submission**: Optimistic prevents UI issues
- ✅ **Debouncing**: Prevents rapid API calls
- ✅ **Loading States**: Prevent user confusion

**Implementation:**

```tsx
// Debouncing prevents rapid calls
export function useUpdateCartItem(options?: UseUpdateCartItemOptions) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    dispatch(updateCartItemOptimistic({ id, quantity }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      // Server call after 500ms of no changes
      const response = await updateCartItemAction({ cartItemId: id, quantity });
      // Handle response...
    }, options?.debounceMs || 500);
  }, []);
}
```

---

### Browser Compatibility

- ✅ **localStorage Not Available**: Graceful degradation
- ✅ **Private Browsing**: Falls back to session memory
- ✅ **Disabled localStorage**: Works in memory
- ✅ **Cookies Disabled**: Uses localStorage if available
- ✅ **Modern Browsers**: Full feature support

**Implementation:**

```tsx
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// Use gracefully
if (isLocalStorageAvailable()) {
  saveCartToLocalStorage(items);
} // else: cart stays in memory
```

---

### Mobile & Touch Devices

- ✅ **Touch-Friendly Buttons**: Adequate size (44x44px)
- ✅ **Drawer Animation**: Smooth on mobile
- ✅ **Responsive Layout**: Works on all screen sizes
- ✅ **Number Input**: Mobile number pad
- ✅ **Scroll Performance**: Optimized for mobile

**Implementation:**

```tsx
// In CartItem component
<input
  type="number"
  min="1"
  max={item.stock}
  value={item.quantity}
  className="h-8 w-10 rounded border text-center" // Adequate touch target
/>;

// In Sheet component
side: ('right', // Draws from right on mobile
  (className = 'w-3/4 sm:w-[440px]')); // Full width on mobile, fixed on desktop
```

---

### Performance Edge Cases

- ✅ **Large Carts** (100+ items): Pagination or scroll
- ✅ **Slow Network**: Shows loading states
- ✅ **Rapid Updates**: Debounced to prevent overload
- ✅ **Memory Leaks**: Cleanup on unmount
- ✅ **Re-render Waste**: Memoized selectors

**Implementation:**

```tsx
// Memoized selectors prevent unnecessary re-renders
export const selectCartTotalPrice = (state: RootState): number => {
  return (
    Math.round(
      state.cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0) * 100,
    ) / 100
  );
};

// Only recalculates if items actually change
const totalPrice = useSelector(selectCartTotalPrice);
```

---

## 🚨 Production Issues to Monitor

### Critical Issues

| Issue            | Detection                   | Solution               |
| ---------------- | --------------------------- | ---------------------- |
| Cart Loss        | Monitor localStorage errors | Log to error tracking  |
| Stock Mismatch   | Compare server vs cart      | Sync on each operation |
| Price Overcharge | Audit price snapshots       | Refund if error        |
| Double Charge    | Check Stripe webhooks       | Idempotency keys       |
| Lost Orders      | Monitor order creation      | Retry with unique ID   |

### Performance Issues

| Metric              | Threshold     | Action               |
| ------------------- | ------------- | -------------------- |
| Add to Cart latency | >1s           | Check server         |
| Cart load time      | >500ms        | Add skeleton         |
| localStorage size   | >5MB          | Implement pagination |
| Redux store size    | >50KB         | Consider splitting   |
| Re-renders          | >3 per update | Add memoization      |

### Error Rates

| Error               | Target | Alert Level      |
| ------------------- | ------ | ---------------- |
| Validation errors   | <1%    | Warning at 2%    |
| Server errors       | <0.5%  | Critical at 1%   |
| Network errors      | <2%    | Warning at 5%    |
| Merge failures      | <0.1%  | Critical at 0.5% |
| localStorage errors | <1%    | Warning at 2%    |

---

## 🔒 Security Considerations

### Input Validation

```tsx
// ✅ All inputs validated with Zod
const validatedInput = AddToCartSchema.parse(input);

// ✅ Schema prevents:
- Negative quantities
- Invalid product IDs
- Malformed URLs
- Invalid prices
```

### Price Security

```tsx
// ✅ Price snapshots prevent manipulation
// Customer cannot change priceSnapshot field
// Server uses database price at checkout
```

### Authentication

```tsx
// ✅ User owns their cart (server validates)
const session = await getCurrentUserSession();
if (!session.userId) {
  // Cart is guest-only
}

// ✅ Verify user on server actions
export async function updateCartItem(input: unknown) {
  // User validated by getCurrentUserSession()
}
```

### Rate Limiting (Recommended)

```tsx
// TODO: Add rate limiting on server actions
// Prevent: Rapid add/update/remove
// Prevent: Spam requests
// Prevent: Denial of service
```

---

## 📊 Monitoring & Analytics

### Recommended Events to Track

```tsx
// Add to Cart
trackEvent('add_to_cart', {
  productId,
  quantity,
  price,
  userType: 'guest|authenticated',
});

// Remove from Cart
trackEvent('remove_from_cart', {
  productId,
  itemsRemainingInCart,
});

// Checkout
trackEvent('begin_checkout', {
  itemCount,
  cartValue,
  itemTypes: ['variant1', 'variant2'],
});

// Cart Merge
trackEvent('cart_merged', {
  guestItemCount,
  userItemCount,
  mergedItemCount,
});
```

---

## 🧪 Testing Edge Cases

### Unit Tests

```typescript
// Test mergeCartsLogic
- Empty guest cart
- Empty user cart
- Both empty
- Duplicate products
- Stock limits
- Price updates

// Test validateCartItem
- Negative quantity
- Zero quantity
- Quantity > stock
- Missing fields
- Invalid price
```

### Integration Tests

```typescript
// Test cart flow
- Add → Update → Remove
- Add → Logout → Login → Merge
- Add → Stock change → Update
- Add → Clear → Add again
- Concurrent updates
```

### Edge Case Tests

```typescript
// Test edge cases
- localStorage full (>5MB)
- localStorage unavailable
- Network timeout during add
- Server error during update
- Race condition on merge
- Very large cart (1000 items)
- Very old localStorage data
```

---

## 📋 Pre-Production Checklist

- [ ] All inputs validated (Zod)
- [ ] All error cases handled
- [ ] Rollback mechanism tested
- [ ] localStorage fallbacks work
- [ ] Network errors handled
- [ ] Stock validation server-side
- [ ] Price immutability enforced
- [ ] Auth integration verified
- [ ] Database queries optimized
- [ ] Rate limiting implemented
- [ ] Error tracking setup
- [ ] Analytics events logged
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Mobile testing done
- [ ] Accessibility verified
- [ ] Documentation complete

---

## 🚀 Production Deployment

1. **Pre-Deployment**
   - Run full test suite
   - Load test with expected traffic
   - Security audit
   - Browser compatibility check

2. **Deployment**
   - Use feature flags for gradual rollout
   - Monitor error rates
   - Watch for performance issues
   - Be ready to rollback

3. **Post-Deployment**
   - Monitor error tracking
   - Check analytics
   - Get user feedback
   - Fix issues quickly

---

This cart system is designed to handle real-world scenarios with graceful degradation and maximum reliability.
