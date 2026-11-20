import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
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

const FALLBACK_NAME = 'HB Plus member';

/**
 * Used only when Firestore is unavailable. It deliberately grants the lowest
 * privilege level — a custom claim is still required for admin access.
 */
export function createFallbackProfile(user: User): UserProfile {
  return {
    uid: user.uid,
    email: (user.email ?? '').toLowerCase(),
    displayName: user.displayName || (user.email ?? '').split('@')[0] || FALLBACK_NAME,
    photoURL: user.photoURL ?? null,
    role: 'user',
    createdAt: null,
    lastLoginAt: null,
  };
}

/**
 * Creates the user document on first login and refreshes harmless profile
 * fields afterwards.
 *
 * IMPORTANT: new accounts are ALWAYS created with the `user` role. Admin is a
 * trusted privilege: it can only be granted by an existing admin through the
 * admin console (Firestore write) or by a Firebase custom claim. Firestore
 * rules reject a client trying to create itself as an admin.
 */
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const ref = doc(firestore, 'users', user.uid);
  const snapshot = await getDoc(ref);
  const email = (user.email ?? '').toLowerCase();
  const displayName = user.displayName || email.split('@')[0] || FALLBACK_NAME;

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email,
      displayName,
      photoURL: user.photoURL ?? null,
      role: 'user' as const,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return {
      uid: user.uid,
      email,
      displayName,
      photoURL: user.photoURL ?? null,
      role: 'user',
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

/** Fetch registered users for the admin console (admin access enforced by rules). */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  try {
    const usersQuery = query(collection(firestore, 'users'), limit(50));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        email: data.email ?? '',
        displayName: data.displayName ?? FALLBACK_NAME,
        photoURL: data.photoURL ?? null,
        role: (data.role as UserRole) ?? 'user',
        createdAt: (data.createdAt as Timestamp) ?? null,
        lastLoginAt: (data.lastLoginAt as Timestamp) ?? null,
      };
    });
  } catch (error) {
    console.warn('[fetchAllUsers] Unable to load users:', error);
    return [];
  }
}

/** Change a user's role. Caller must already be an admin (enforced by rules). */
export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
  const ref = doc(firestore, 'users', uid);
  await updateDoc(ref, { role: newRole });
}
