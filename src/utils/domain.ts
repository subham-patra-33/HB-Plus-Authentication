import { ALLOWED_EMAIL_DOMAIN, ACCESS_RESTRICTED_MESSAGE } from '@/config/app';

export class DomainRestrictionError extends Error {
  constructor() {
    super(ACCESS_RESTRICTED_MESSAGE);
    this.name = 'DomainRestrictionError';
  }
}

/** Firebase lower-cases emails, but we normalize again for defense in depth. */
export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase();
}

export function emailDomain(email: string | null | undefined): string {
  const normalized = normalizeEmail(email);
  const parts = normalized.split('@');
  return parts.length === 2 ? parts[1] : '';
}

/**
 * Exact (case-insensitive) match on the domain — `evilhbplus.fit` or
 * `hbplus.fit.attacker.com` must never pass.
 */
export function isAllowedEmailDomain(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  const parts = normalized.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  return parts[1] === ALLOWED_EMAIL_DOMAIN;
}

export function assertAllowedEmailDomain(
  email: string | null | undefined,
): asserts email is string {
  if (!isAllowedEmailDomain(email)) {
    throw new DomainRestrictionError();
  }
}
