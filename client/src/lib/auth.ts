import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

export function getDiscordLoginUrl(state?: string) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: window.location.origin + '/api/auth/discord/callback',
    response_type: "code",
    scope: "identify",
    ...(state ? { state } : {})
  });

  return `/api/auth/discord?${params}`;
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