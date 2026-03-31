'use client';

import { useHeader } from '@/components/header/HeaderContext';
import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';

export function HeaderStateExample() {
  const t = useTranslations();
  const { cart, updateCartItems, auth, login, logout } = useHeader();

  return (
    <div className="space-y-4 p-6">
      <div className="border-border bg-accent/10 rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-bold tracking-wide uppercase">Header State Example</h2>

        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground text-sm">Cart Items</p>
            <p className="text-2xl font-bold">{cart.items}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => updateCartItems(cart.items + 1)}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-3 py-1 text-sm"
              >
                +1
              </button>
              <button
                onClick={() => updateCartItems(Math.max(0, cart.items - 1))}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-3 py-1 text-sm"
              >
                -1
              </button>
            </div>
          </div>

          <div className="border-border border-t pt-3">
            <p className="text-muted-foreground text-sm">Auth Status</p>
            <p className="text-sm font-medium">
              {auth.isLoggedIn ? `Logged in as ${auth.user?.name}` : 'Not logged in'}
            </p>
            {auth.isLoggedIn ? (
              <button
                onClick={logout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 mt-2 rounded-md px-3 py-1 text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => login({ name: 'John Doe', email: 'john@example.com' })}
                className="bg-foreground text-background hover:bg-foreground/90 mt-2 rounded-md px-3 py-1 text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
