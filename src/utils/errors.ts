import { ACCESS_RESTRICTED_MESSAGE } from '@/config/app';
import { DomainRestrictionError } from './domain';

type FirebaseLikeError = { code?: string; message?: string };

function codeOf(error: unknown): string {
  if (!error || typeof error !== 'object') return '';
  return String((error as FirebaseLikeError).code ?? '');
}

function messageOf(error: unknown): string {
  if (!error || typeof error !== 'object') return '';
  return String((error as FirebaseLikeError).message ?? '');
}

const MESSAGES: Record<string, string> = {
  // Web / Firebase Auth
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked':
    'Your browser blocked the sign-in pop-up. Allow pop-ups for this site and try again.',
  'auth/unauthorized-domain':
    'This domain is not authorized in Firebase. Add it under Authentication > Settings > Authorized domains.',
  'auth/operation-not-allowed':
    'Google sign-in is not enabled in the Firebase console (Authentication > Sign-in method).',
  'auth/account-exists-with-different-credential':
    'An account already exists with this email using a different sign-in method.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/invalid-api-key': 'Firebase configuration is invalid. Check your .env file.',
  'auth/user-disabled': 'This account has been disabled.',

  // @react-native-google-signin/google-signin
  SIGN_IN_CANCELLED: 'Sign-in was cancelled. Please try again.',
  IN_PROGRESS: 'A sign-in is already in progress. Please try again shortly.',
  PLAY_SERVICES_NOT_AVAILABLE:
    'Google Play Services are not available on this device.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof DomainRestrictionError) return ACCESS_RESTRICTED_MESSAGE;

  const code = codeOf(error);
  if (MESSAGES[code]) return MESSAGES[code];

  const message = messageOf(error);
  if (message) return message;

  return 'Unable to sign in right now. Please try again.';
}
