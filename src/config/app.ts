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

export const ACCESS_RESTRICTED_MESSAGE =
  'Access restricted. Please login using your official domain email.';

// A client-visible administrator email list was intentionally removed.
// Administrator privileges are granted only through a trusted Firestore user
// record or a Firebase custom claim.
