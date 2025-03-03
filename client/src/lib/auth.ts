import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

export function getDiscordLoginUrl(returnPath?: string) {
  // Use the current URL as the base for the auth endpoint
  const baseUrl = window.location.origin;
  const returnTo = returnPath || window.location.pathname;
  const authUrl = `${baseUrl}/api/auth/discord?returnTo=${encodeURIComponent(returnTo)}`;
  console.log('Auth URL:', authUrl); // Debug log
  return authUrl;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include'
    });

    if (!res.ok) {
      if (res.status === 401) return null;
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest("POST", "/api/auth/logout");
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

export async function loginWithDiscord(code: string): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/discord", { code });
  return res.json();
}