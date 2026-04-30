/**
 * Cart System Type Definitions
 * Comprehensive types for hybrid cart (guest + logged-in users)
 */

import { Product } from './product';

/**
 * Product variant information
 * Supports multiple variant types (size, color, etc.)
 */
export interface CartItemVariant {
  id: string;
  name: string;
  value: string;
}

/**
 * Cart item as stored in cart
 * Price snapshot: stores price at time of addition (prevents price changes after adding)
 * Variants: supports product variants like size, color
 */
export interface CartItem {
  id: string; // UUID or unique identifier
  productId: string;
  name: string;
  priceSnapshot: number; // Price at time of adding to cart
  quantity: number;
  image: string;
  stock: number; // Available stock
  variants?: CartItemVariant[]; // e.g., [{ id: 'size-1', name: 'size', value: 'M' }]
  variantId?: string; // Unique identifier for variant combination
}

/**
 * Cart state as stored in localStorage or server
 */
export interface Cart {
  items: CartItem[];
  lastUpdated?: number; // Timestamp for cache validation
}

/**
 * User session info for determining cart source
 */
export interface UserSession {
  userId?: string;
  isAuthenticated: boolean;
}

/**
 * Server action response shape (consistent across all cart actions)
 */
export interface CartActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Add to cart request payload
 */
export interface AddToCartPayload {
  productId: string;
  name: string;
  priceSnapshot: number;
  quantity: number;
  image: string;
  stock: number;
  variants?: CartItemVariant[];
  variantId?: string;
}

/**
 * Update cart item request payload
 */
export interface UpdateCartItemPayload {
  cartItemId: string;
  quantity: number;
}

/**
 * Remove cart item request payload
 */
export interface RemoveCartItemPayload {
  cartItemId: string;
}

/**
 * Merge cart request (from guest to logged-in user)
 */
export interface MergeCartPayload {
  guestCart: CartItem[];
  userId: string;
}

/**
 * Cart totals
 */
export interface CartTotals {
  itemCount: number;
  totalPrice: number;
  itemsCount: number; // Alias for itemCount
}

/**
 * Stock validation result
 */
export interface StockValidationResult {
  isValid: boolean;
  availableQuantity: number;
  message?: string;
}
