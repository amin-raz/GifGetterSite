import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "your_client_id";

// Get the domain from environment variables, fallback to localhost for development
const domain = import.meta.env.VITE_APP_DOMAIN || window.location.host;
const protocol = domain.includes('localhost') ? 'http' : 'https';
export const DISCORD_REDIRECT_URI = `${protocol}://${domain}/api/auth/discord/callback`;

export function getDiscordLoginUrl(returnPath?: string) {
  const returnTo = returnPath || window.location.pathname;
  const authEndpoint = `/api/auth/discord?returnTo=${encodeURIComponent(returnTo)}`;
  return authEndpoint;
}

export async function loginWithDiscord(code: string): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/discord", { code });
  return res.json();
}