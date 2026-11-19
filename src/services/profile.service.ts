import { doc, getDoc, serverTimestamp, setDoc, type Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { isAdminEmail } from '@/config/app';
import { firestore } from '@/config/firebaseApp';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp | null;
  lastLoginAt: Timestamp | null;
}

/**
 * Creates the user document on first login and refreshes harmless profile
 * fields afterwards. `role` is written only on creation so a client can never
 * promote itself — Firestore rules enforce the same invariant server-side.
 */
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const ref = doc(firestore, 'users', user.uid);
  const snapshot = await getDoc(ref);
  const email = (user.email ?? '').toLowerCase();
  const displayName = user.displayName || email.split('@')[0] || 'HB Plus user';
  const role: UserRole = isAdminEmail(email) ? 'admin' : 'user';

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email,
      displayName,
      photoURL: user.photoURL ?? null,
      role,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return {
      uid: user.uid,
      email,
      displayName,
      photoURL: user.photoURL ?? null,
      role,
      createdAt: null,
      lastLoginAt: null,
    };
  }

  const data = snapshot.data();
  await setDoc(
    ref,
    {
      displayName,
      photoURL: user.photoURL ?? null,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );

  return {
    uid: user.uid,
    email,
    displayName,
    photoURL: user.photoURL ?? null,
    role: (data.role as UserRole) ?? 'user',
    createdAt: (data.createdAt as Timestamp) ?? null,
    lastLoginAt: (data.lastLoginAt as Timestamp) ?? null,
  };
}
