import { useLocation } from "wouter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import { getCurrentUser, getDiscordLoginUrl } from "./auth";
import type { User } from "@shared/schema";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (!currentUser) {
          // Redirect to Discord login with return path
          window.location.href = getDiscordLoginUrl(path);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [path, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => window.location.href = getDiscordLoginUrl(path)}
          className="text-primary hover:underline"
        >
          Try logging in again
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Component />;
}