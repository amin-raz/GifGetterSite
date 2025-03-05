import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

// Helper function to get the base URL for the application
function getBaseUrl() {
  // Check if we're running on Replit
  if (window.location.hostname.includes('replit.dev')) {
    // Use the exact Replit domain
    return 'https://cd8b2f32-42e4-4c51-bc8a-8f1cfb255c3e-00-1fk8ng1yhc5k7.janeway.replit.dev';
  }
  // Fallback to localhost for development
  return 'http://localhost:5000';
}

export function getDiscordLoginUrl(state?: string) {
  const baseUrl = getBaseUrl();
  console.log('Using base URL for Discord auth:', baseUrl); // Debug log
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: `${baseUrl}/api/auth/discord/callback`,
    response_type: "code",
    scope: "identify email",
    ...(state ? { state } : {})
  });

  return `https://discord.com/api/oauth2/authorize?${params}`;
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