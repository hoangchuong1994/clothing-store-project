/\*\*

- INTEGRATION EXAMPLES
- Complete examples showing how to integrate the cart system
  \*/

/\*\*

- ═══════════════════════════════════════════════════════════════
- 1.  ROOT LAYOUT SETUP
- ═══════════════════════════════════════════════════════════════
-
- File: src/app/layout.tsx
  \*/

// import { ReduxProvider } from '@/lib/client/providers/ReduxProvider';
//
// export default function RootLayout({
// children,
// }: {
// children: React.ReactNode;
// }) {
// return (
// <html lang="en">
// <body>
// <ReduxProvider>
// {children}
// </ReduxProvider>
// </body>
// </html>
// );
// }

/\*\*

- ═══════════════════════════════════════════════════════════════
- 2.  HEADER WITH CART DRAWER
- ═══════════════════════════════════════════════════════════════
-
- File: src/components/header/HeaderWithCart.tsx
- Shows how to add cart drawer to existing header
  \*/

// 'use client';
//
// import { ShoppingCart } from 'lucide-react';
// import { useCartDrawer } from '@/hooks/cart';
// import { useCart } from '@/hooks/cart';
// import { CartDrawer } from '@/components/cart';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
//
// export function HeaderWithCart() {
// const { isOpen, open, close } = useCartDrawer();
// const { itemCount } = useCart();
//
// return (
// <>
// <button
// onClick={open}
// className="relative p-2"
// aria-label="Shopping cart"
// >
// <ShoppingCart className="w-6 h-6" />
// {itemCount > 0 && (
// <Badge
// className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
// variant="destructive"
// >
// {itemCount}
// </Badge>
// )}
// </button>
//
// <CartDrawer isOpen={isOpen} onClose={close} />
// </>
// );
// }

/\*\*

- ═══════════════════════════════════════════════════════════════
- 3.  PRODUCT CARD WITH ADD TO CART
- ═══════════════════════════════════════════════════════════════
-
- File: src/components/ProductCardWithCart.tsx
  \*/

// 'use client';
//
// import { AddToCartButton } from '@/components/cart';
// import { Product } from '@/lib/types/cart';
//
// interface ProductCardProps {
// product: Product;
// }
//
// export function ProductCard({ product }: ProductCardProps) {
// return (
// <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
// {/_ Product Image _/}
// <div className="aspect-square overflow-hidden bg-gray-100">
// <img
// src={product.image}
// alt={product.name}
// className="w-full h-full object-cover hover:scale-105 transition-transform"
// />
// </div>
//
// {/_ Product Info _/}
// <div className="p-4">
// <h3 className="font-semibold text-lg truncate">{product.name}</h3>
//
// <div className="flex items-center justify-between mt-2">
// <span className="text-2xl font-bold text-green-600">
// ${product.price.toFixed(2)}
//           </span>
//           <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
//             {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
// </span>
// </div>
//
// {/_ Add to Cart Button _/}
// <AddToCartButton
// productId={product.id}
// name={product.name}
// priceSnapshot={product.price}
// image={product.image}
// stock={product.stock}
// variants={product.variants}
// className="w-full mt-4"
// onSuccess={() => {
// // Show toast notification
// console.log('Added to cart!');
// }}
// />
// </div>
// </div>
// );
// }

/\*\*

- ═══════════════════════════════════════════════════════════════
- 4.  CUSTOM CART PAGE
- ═══════════════════════════════════════════════════════════════
-
- File: src/app/[locale]/cart/page.tsx
- Full cart page (alternative to drawer)
  \*/

// 'use client';
//
// import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/cart';
// import { CartItem } from '@/components/cart';
// import { Button } from '@/components/ui/button';
// import { CartSummary } from '@/components/cart';
//
// export default function CartPage() {
// const { items, isEmpty } = useCart();
//
// if (isEmpty) {
// return (
// <div className="min-h-screen flex items-center justify-center">
// <div className="text-center">
// <h1 className="text-2xl font-bold">Your cart is empty</h1>
// <p className="text-gray-600 mt-2">Start shopping to add items</p>
// </div>
// </div>
// );
// }
//
// return (
// <div className="max-w-4xl mx-auto p-4">
// <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
//
// <div className="grid grid-cols-3 gap-4">
// {/_ Items _/}
// <div className="col-span-2 space-y-4">
// {items.map((item) => (
// <CartItem key={item.id} item={item} />
// ))}
// </div>
//
// {/_ Summary _/}
// <div className="col-span-1">
// <div className="border rounded-lg p-6 sticky top-4">
// <h2 className="text-xl font-bold mb-4">Order Summary</h2>
// <CartSummary
// subtotal={items.reduce((sum, item) => sum + item.priceSnapshot _ item.quantity, 0)}
// tax={items.reduce((sum, item) => sum + item.priceSnapshot _ item.quantity, 0) _ 0.08}
// total={items.reduce((sum, item) => sum + item.priceSnapshot _ item.quantity, 0) \* 1.08}
// />
// <Button className="w-full mt-4">Checkout</Button>
// </div>
// </div>
// </div>
// </div>
// );
// }

/\*\*

- ═══════════════════════════════════════════════════════════════
- 5.  ADVANCED - USING useTransition FOR FORM SUBMISSION
- ═══════════════════════════════════════════════════════════════
-
- For form-based add to cart with server actions
  \*/

// 'use client';
//
// import { useTransition } from 'react';
// import { addToCart } from '@/lib/server/actions/cart';
// import { AddToCartPayload } from '@/lib/types/cart';
// import { Button } from '@/components/ui/button';
//
// export function AddToCartForm({ product }) {
// const [isPending, startTransition] = useTransition();
//
// const handleSubmit = (e: React.FormEvent) => {
// e.preventDefault();
//
// const payload: AddToCartPayload = {
// productId: product.id,
// name: product.name,
// priceSnapshot: product.price,
// quantity: 1,
// image: product.image,
// stock: product.stock,
// };
//
// startTransition(async () => {
// const result = await addToCart(payload);
// if (result.success) {
// // Success - Redux already updated optimistically
// } else {
// // Error handling
// console.error(result.error?.message);
// }
// });
// };
//
// return (
// <form onSubmit={handleSubmit}>
// <Button type="submit" disabled={isPending}>
// {isPending ? 'Adding...' : 'Add to Cart'}
// </Button>
// </form>
// );
// }

/\*\*

- ═══════════════════════════════════════════════════════════════
- 6.  ADVANCED - MERGING CARTS ON LOGIN
- ═══════════════════════════════════════════════════════════════
-
- Call this when user logs in
  \*/

// 'use client';
//
// import { useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { mergeCart } from '@/lib/server/actions/cart';
// import { selectCartItems, mergeCartSuccess } from '@/lib/client/redux/cartSlice';
// import { clearCartFromLocalStorage } from '@/lib/client/utils/cart';
// import { AppDispatch } from '@/lib/client/redux/store';
//
// export function useCartMergeOnLogin() {
// const dispatch = useDispatch<AppDispatch>();
// const guestCartItems = useSelector(selectCartItems);
//
// const mergeOnLogin = useCallback(async () => {
// if (guestCartItems.length === 0) return;
//
// const response = await mergeCart({
// guestCart: guestCartItems,
// userId: 'current-user-id', // Get from auth context
// });
//
// if (response.success && response.data) {
// // Update Redux with merged cart
// dispatch(mergeCartSuccess({ items: response.data.items }));
//
// // Clear guest cart from localStorage
// clearCartFromLocalStorage();
// }
// }, [guestCartItems, dispatch]);
//
// return { mergeOnLogin };
// }

/\*\*

- ═══════════════════════════════════════════════════════════════
- 7.  ADVANCED - CUSTOM REDUX DISPATCH
- ═══════════════════════════════════════════════════════════════
-
- For complex scenarios requiring direct Redux access
  \*/

// 'use client';
//
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/lib/client/redux/store';
// import {
// selectCartItems,
// selectCartTotalPrice,
// clearCartOptimistic,
// } from '@/lib/client/redux/cartSlice';
// import { clearCart } from '@/lib/server/actions/cart';
//
// export function useCustomCartOperation() {
// const dispatch = useDispatch<AppDispatch>();
// const items = useSelector(selectCartItems);
// const totalPrice = useSelector(selectCartTotalPrice);
//
// const handleCheckout = async () => {
// // Optimistic update
// dispatch(clearCartOptimistic());
//
// try {
// // Server action
// const response = await clearCart({});
//
// if (!response.success) {
// throw new Error(response.error?.message);
// }
//
// // Success - cart already cleared in Redux
// console.log('Checkout successful');
// } catch (error) {
// // Rollback happens automatically in Redux on error
// console.error('Checkout failed:', error);
// }
// };
//
// return { handleCheckout, items, totalPrice };
// }

export {};
