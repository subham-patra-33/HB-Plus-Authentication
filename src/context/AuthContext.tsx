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
import {
  getRedirectCredential,
  signInWithGoogle,
  signOutFromProvider,
} from '@/services/googleSignIn';
import { ensureUserProfile, type UserProfile } from '@/services/profile.service';
import { assertAllowedEmailDomain, isAllowedEmailDomain, DomainRestrictionError } from '@/utils/domain';
import { getAuthErrorMessage } from '@/utils/errors';

export interface AuthenticatedUser {
  firebaseUser: User;
  profile: UserProfile;
}

interface AuthContextValue {
  user: AuthenticatedUser | null;
  /** True during session restore AND while a sign-in/out request is in flight. */
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  /** Signs out everywhere and surfaces the mandatory domain-restriction message. */
  const rejectUnauthorizedUser = useCallback(async () => {
    await signOut(auth);
    await signOutFromProvider();
    if (mounted.current) {
      setUser(null);
      setError(ACCESS_RESTRICTED_MESSAGE);
    }
  }, []);

  const applyCredential = useCallback(async (credential: UserCredential) => {
    assertAllowedEmailDomain(credential.user.email);
    const profile = await ensureUserProfile(credential.user);
    if (mounted.current) {
      setUser({ firebaseUser: credential.user, profile });
      setError(null);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    let unsubscribe: () => void = () => {};

    // Finish a web redirect flow (browser returned to the app).
    void (async () => {
      try {
        const redirected = await getRedirectCredential();
        if (redirected && mounted.current) await applyCredential(redirected);
      } catch (caught) {
        if (caught instanceof DomainRestrictionError) {
          await rejectUnauthorizedUser();
        } else if (mounted.current) {
          setError(getAuthErrorMessage(caught));
        }
      } finally {
        if (mounted.current) setIsInitializing(false);
      }
    })();

    // Single source of truth for the session (covers restore, popup and redirect).
    unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted.current) return;

      if (!firebaseUser) {
        setUser(null);
        setIsInitializing(false);
        return;
      }

      // Defense in depth: even a pre-existing Firebase session from a personal
      // account must not be allowed to restore inside this app.
      if (!isAllowedEmailDomain(firebaseUser.email)) {
        await rejectUnauthorizedUser();
        setIsInitializing(false);
        return;
      }

      try {
        const profile = await ensureUserProfile(firebaseUser);
        if (mounted.current) setUser({ firebaseUser, profile });
      } catch (caught) {
        if (mounted.current) setError(getAuthErrorMessage(caught));
      } finally {
        if (mounted.current) setIsInitializing(false);
      }
    });

    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, [applyCredential, rejectUnauthorizedUser]);

  const signIn = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const credential = await signInWithGoogle();
      // `null` means the browser is navigating away for a redirect flow; the
      // result is handled by getRedirectCredential() after the page remounts.
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
        setError(null);
      }
    } catch (caught) {
      if (mounted.current) setError(getAuthErrorMessage(caught));
    } finally {
      if (mounted.current) setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: isInitializing || isSubmitting,
      error,
      isAdmin: user?.profile.role === 'admin',
      signIn,
      logout,
      clearError,
    }),
    [user, isInitializing, isSubmitting, error, signIn, logout, clearError],
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
