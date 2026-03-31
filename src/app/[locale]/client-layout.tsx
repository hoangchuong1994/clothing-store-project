'use client';

import { Header } from '@/components/header/Header';
import { HeaderProvider, useHeader } from '@/components/header/HeaderContext';

function HeaderWithState() {
  const { cart, auth, logout } = useHeader();

  return <Header cartItems={cart.items} isLoggedIn={auth.isLoggedIn} onLogout={logout} />;
}

export function ClientLocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <div className="bg-background min-h-screen">
        <HeaderWithState />
        {children}
      </div>
    </HeaderProvider>
  );
}
