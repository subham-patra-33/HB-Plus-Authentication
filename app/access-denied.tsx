import { Redirect, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { AccessDeniedScreenView } from '@/screens/AccessDeniedScreen';

export default function AccessDeniedRoute() {
  const { user, clearError } = useAuth();

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  const handleReturn = () => {
    clearError();
    router.replace('/login');
  };

  return <AccessDeniedScreenView onReturnToLogin={handleReturn} />;
}
