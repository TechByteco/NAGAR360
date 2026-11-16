import { User, Role, Language } from '../types';
import { DEMO_CITIZEN, DEMO_OFFICIAL } from '../store';

const AUTH_STORAGE_KEY = 'nagar360_current_user';
const OFFICIAL_CREDS_KEY = 'nagar360_official_creds_v1';

export interface OfficialCredentials {
  userId: string;
  password: string;
}

export function getOfficialCredentials(): OfficialCredentials {
  if (typeof window === 'undefined') return { userId: 'admin', password: 'admin@123' };
  const stored = localStorage.getItem(OFFICIAL_CREDS_KEY);
  if (!stored) {
    const defaultCreds = { userId: 'admin', password: 'admin@123' };
    localStorage.setItem(OFFICIAL_CREDS_KEY, JSON.stringify(defaultCreds));
    return defaultCreds;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { userId: 'admin', password: 'admin@123' };
  }
}

export function updateOfficialCredentials(newUserId: string, newPassword: string): void {
  if (typeof window === 'undefined') return;
  const updated = { userId: newUserId.trim(), password: newPassword.trim() };
  localStorage.setItem(OFFICIAL_CREDS_KEY, JSON.stringify(updated));
}

export function authenticateOfficial(userId: string, password: string): { success: boolean; error?: string } {
  const creds = getOfficialCredentials();
  if (userId.trim() === creds.userId && password.trim() === creds.password) {
    const officialUser: User = {
      ...DEMO_OFFICIAL,
      email: `${creds.userId}@chennaicorporation.gov.in`,
    };
    setCurrentUser(officialUser);
    return { success: true };
  }
  return { success: false, error: 'Invalid Official User ID or Password.' };
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return DEMO_CITIZEN;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEMO_CITIZEN;
    }
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_CITIZEN));
  return DEMO_CITIZEN;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('nagar360_auth_update'));
  window.dispatchEvent(new Event('storage'));
}

export function signInDemoCitizen(): User {
  setCurrentUser(DEMO_CITIZEN);
  return DEMO_CITIZEN;
}

export function signInDemoOfficial(): User {
  return signInWithOfficialDefault();
}

export function signInWithOfficialDefault(): User {
  const creds = getOfficialCredentials();
  const officialUser: User = {
    ...DEMO_OFFICIAL,
    email: `${creds.userId}@chennaicorporation.gov.in`,
  };
  setCurrentUser(officialUser);
  return officialUser;
}

export function signInWithGoogle(customEmail?: string, customName?: string): User {
  const email = customEmail?.trim() || 'citizen.google@gmail.com';
  const name = customName?.trim() || (email.split('@')[0] ? `${email.split('@')[0]} (Google)` : 'Google Resident');
  
  const googleUser: User = {
    id: `usr-google-${Date.now()}`,
    fullName: name,
    email,
    phone: '+91 98409 87654',
    role: 'citizen',
    city: 'Chennai',
    preferredLanguage: 'en',
    civicPoints: 200,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(googleUser);
  return googleUser;
}

export function signUpUser(data: {
  fullName: string;
  email: string;
  phone?: string;
  city: string;
  preferredLanguage: Language;
  role?: Role;
}): User {
  const newUser: User = {
    id: `usr-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    role: data.role || 'citizen',
    city: data.city || 'Chennai',
    preferredLanguage: data.preferredLanguage || 'en',
    civicPoints: 100,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(newUser);
  return newUser;
}

export function signOutUser(): void {
  setCurrentUser(null);
}
