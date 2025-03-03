import { useAuthenticator } from '@aws-amplify/ui-react';
import { Route, useLocation } from "wouter";
import { getDiscordLoginUrl } from "@/lib/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { authStatus } = useAuthenticator();
  const [location] = useLocation();

  if (authStatus === 'configuring' || authStatus === 'loading') {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      </Route>
    );
  }

  if (authStatus !== 'authenticated') {
    // Store the current path in localStorage before redirecting
    localStorage.setItem('redirectPath', location);
    window.location.href = getDiscordLoginUrl();
    return null;
  }

  return <Route path={path} component={Component} />;
}