import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, signOut, type User, type UserCredential } from 'firebase/auth';
import { ACCESS_RESTRICTED_MESSAGE } from '@/config/app';
import { auth } from '@/config/auth';
import { isFirebaseConfigured, getFirebaseConfigErrorMessage } from '@/config/firebaseApp';
import {
  getRedirectCredential,
  signInWithGoogle,
  signOutFromProvider,
} from '@/services/googleSignIn';
import {
  createFallbackProfile,
  ensureUserProfile,
  type UserProfile,
} from '@/services/profile.service';
import {
  assertAllowedEmailDomain,
  isAllowedEmailDomain,
  DomainRestrictionError,
} from '@/utils/domainValidation';
import { getAuthErrorMessage } from '@/utils/errors';

export interface AuthenticatedUser {
  firebaseUser: User;
  profile: UserProfile;
  /** True when a trusted DB role OR a Firebase custom claim grants admin. */
  isAdmin: boolean;
}

interface AuthContextValue {
  user: AuthenticatedUser | null;
  /** True during session restore AND while a sign-in/out request is in flight. */
  loading: boolean;
  error: string | null;
  /** Set only after a domain rejection, so the UI can show the dedicated screen. */
  accessDenied: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  clearAccessDenied: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    isFirebaseConfigured ? null : getFirebaseConfigErrorMessage(),
  );
  const [accessDenied, setAccessDenied] = useState(false);
  const mounted = useRef(true);

  /** Signs out everywhere, clears state and records the domain rejection. */
  const rejectUnauthorizedUser = useCallback(async () => {
    try {
      await signOut(auth);
      await signOutFromProvider();
    } catch {
      // Auth may not be fully initialized; state is still cleared below.
    }
    if (mounted.current) {
      setUser(null);
      setAccessDenied(true);
      setError(ACCESS_RESTRICTED_MESSAGE);
    }
  }, []);

  const applyCredential = useCallback(async (credential: UserCredential) => {
    assertAllowedEmailDomain(credential.user.email);
    const tokenResult = await credential.user.getIdTokenResult();
    let profile: UserProfile;
    try {
      profile = await ensureUserProfile(credential.user);
    } catch (caught) {
      console.warn('[HB Plus] Profile service unavailable:', caught);
      profile = createFallbackProfile(credential.user);
    }
    if (mounted.current) {
      setUser({
        firebaseUser: credential.user,
        profile,
        isAdmin: profile.role === 'admin' || tokenResult.claims.admin === true,
      });
      setAccessDenied(false);
      setError(null);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (!isFirebaseConfigured) {
      setError(getFirebaseConfigErrorMessage());
      setIsInitializing(false);
      return;
    }

    let unsubscribe: () => void = () => {};

    // Finish a web redirect flow. `onAuthStateChanged` is the single source of
    // truth and will validate the domain and load the profile for us.
    void getRedirectCredential().catch((caught) => {
      const code =
        caught && typeof caught === 'object' && 'code' in caught
          ? String((caught as { code?: string }).code ?? '')
          : '';
      if (code !== 'auth/no-auth-event' && mounted.current) {
        setError(getAuthErrorMessage(caught));
      }
    });

    // Single source of truth: session restore, popup, redirect and refresh.
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!mounted.current) return;

        if (!firebaseUser) {
          setUser(null);
          setIsInitializing(false);
          return;
        }

        // Defense in depth: a personal account left over from a previous
        // session can never be restored into this application.
        if (!isAllowedEmailDomain(firebaseUser.email)) {
          await rejectUnauthorizedUser();
          setIsInitializing(false);
          return;
        }

        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          let profile: UserProfile;
          try {
            profile = await ensureUserProfile(firebaseUser);
          } catch (caught) {
            // Firestore is optional. Keep the authenticated session alive with
            // a lowest-privilege fallback profile instead of blocking login.
            console.warn('[HB Plus] Profile service unavailable:', caught);
            profile = createFallbackProfile(firebaseUser);
          }
          if (mounted.current) {
            setUser({
              firebaseUser,
              profile,
              isAdmin: profile.role === 'admin' || tokenResult.claims.admin === true,
            });
          }
        } catch (caught) {
          if (mounted.current) setError(getAuthErrorMessage(caught));
        } finally {
          if (mounted.current) setIsInitializing(false);
        }
      });
    } catch (caught) {
      if (mounted.current) {
        setError(getAuthErrorMessage(caught));
        setIsInitializing(false);
      }
    }

    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, [rejectUnauthorizedUser]);

  const signIn = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setAccessDenied(false);
    try {
      const credential = await signInWithGoogle();
      // `null` means the browser is navigating away for a redirect flow; the
      // result is handled after the page remounts.
      if (credential) await applyCredential(credential);
    } catch (caught) {
      if (caught instanceof DomainRestrictionError) {
        await rejectUnauthorizedUser();
      } else if (mounted.current) {
        setError(getAuthErrorMessage(caught));
      }
    } finally {
      if (mounted.current) setIsSubmitting(false);
    }
  }, [applyCredential, rejectUnauthorizedUser]);

  const logout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await signOut(auth);
      await signOutFromProvider();
      if (mounted.current) {
        setUser(null);
        setAccessDenied(false);
        setError(null);
      }
    } catch (caught) {
      if (mounted.current) setError(getAuthErrorMessage(caught));
    } finally {
      if (mounted.current) setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearAccessDenied = useCallback(() => {
    setAccessDenied(false);
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: isInitializing || isSubmitting,
      error,
      accessDenied,
      isAdmin: user?.isAdmin === true,
      signIn,
      logout,
      clearError,
      clearAccessDenied,
    }),
    [
      user,
      isInitializing,
      isSubmitting,
      error,
      accessDenied,
      signIn,
      logout,
      clearError,
      clearAccessDenied,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
