/**
 * Non-secret, build-time application settings.
 * Everything prefixed with EXPO_PUBLIC_ is inlined into the client bundle.
 */

const cleanDomain = (value: string | undefined): string =>
  (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/\/.*$/, '');

export const ALLOWED_EMAIL_DOMAIN =
  cleanDomain(process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN) || 'hbplus.fit';

export const ADMIN_EMAILS = (process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email: string | null | undefined): boolean =>
  !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());

export const ACCESS_RESTRICTED_MESSAGE =
  'Access restricted. Please login using your official domain email.';
