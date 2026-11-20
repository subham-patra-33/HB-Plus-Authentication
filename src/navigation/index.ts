/**
 * Navigation module exports and route utilities for HB Plus.
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ACCESS_DENIED: '/access-denied',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
