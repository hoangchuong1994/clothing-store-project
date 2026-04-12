export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-white to-gray-100 dark:from-slate-950 dark:to-slate-900">
      {children}
    </main>
  );
}
