export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-slate-950 to-slate-900">
      {children}
    </main>
  );
}
