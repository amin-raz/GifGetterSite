import { useLocation } from "wouter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./auth";
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
  const [, setLocation] = useLocation();

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setUser(user);
        setLoading(false);
        if (!user) {
          setLocation('/');
        }
      })
      .catch(() => {
        setLoading(false);
        setLocation('/');
      });
  }, [setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Component />;
}