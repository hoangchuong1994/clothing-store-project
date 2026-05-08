import { AuthShell } from '@/features/auth/ui/components/AuthShell';

export default async function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
