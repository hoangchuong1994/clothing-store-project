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
      <HeaderWithState />
      {children}
    </HeaderProvider>
  );
}
