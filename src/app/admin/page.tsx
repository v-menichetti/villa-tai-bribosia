import { AdminPanel } from '@/components/admin-panel';
import { adminConfigured, authenticated } from '@/lib/auth';
import { getWeeks } from '@/lib/db';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Espace propriétaire',
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  const loggedIn = await authenticated();
  return (
    <AdminPanel
      key={String(loggedIn)}
      weeks={loggedIn ? await getWeeks() : []}
      loggedIn={loggedIn}
      configured={await adminConfigured()}
    />
  );
}
