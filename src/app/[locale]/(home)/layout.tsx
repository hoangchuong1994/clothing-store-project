'use client';

import { Header } from '@/components/header/Header';
import { HeaderProvider, useHeader } from '@/components/header/HeaderContext';

function HeaderWithState() {
  const { cart, auth, logout } = useHeader();

  return <Header cartItems={cart.items} isLoggedIn={auth.isLoggedIn} onLogout={logout} />;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <HeaderWithState />
      <main className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-white to-gray-100 dark:from-slate-950 dark:to-slate-900">
        {children}
      </main>
    </HeaderProvider>
  );
}
