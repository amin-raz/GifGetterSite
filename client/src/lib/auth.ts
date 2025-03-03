import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

export function getDiscordLoginUrl(returnPath?: string) {
  const baseUrl = window.location.origin;
  const returnTo = returnPath || window.location.pathname;
  return `${baseUrl}/api/auth/discord?returnTo=${encodeURIComponent(returnTo)}`;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

export async function loginWithDiscord(code: string): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/discord", { code });
  return res.json();
}