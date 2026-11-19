import type { Persistence } from 'firebase/auth';

/**
 * `getReactNativePersistence` is exported by the React Native build of
 * `firebase/auth` at runtime, but the web typings shipped by Firebase don't
 * declare it. This augmentation keeps the native auth setup type-safe.
 */
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
