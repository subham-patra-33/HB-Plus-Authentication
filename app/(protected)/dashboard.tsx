import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { DashboardScreenView } from '@/screens/DashboardScreen';

export default function DashboardRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/login" />;

  return <DashboardScreenView />;
}
