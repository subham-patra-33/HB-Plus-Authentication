import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreenView } from '@/screens/LoginScreen';

export default function LoginRoute() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Redirect href="/dashboard" />;
  }

  return <LoginScreenView />;
}
