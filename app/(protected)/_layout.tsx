import { Stack, Redirect } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/context/AuthContext';

/**
 * Route guard: every screen inside the (protected) group requires a verified
 * Firebase session. Direct URL access while logged out always redirects.
 */
export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen label="Securing your workspace…" />;
  if (!user) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#F1F5F9' },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
