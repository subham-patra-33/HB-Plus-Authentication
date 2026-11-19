import { getAuth, type Auth } from 'firebase/auth';
import { firebaseApp } from './firebaseApp';

// On the web, Firebase Auth persists the session in IndexedDB by default
// (falls back to localStorage). No tokens are stored in our own code.
export const auth: Auth = getAuth(firebaseApp);
