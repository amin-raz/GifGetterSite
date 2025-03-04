import { useAuthenticator } from '@aws-amplify/ui-react';
import { Route, useLocation } from "wouter";
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
    const loginUrl = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/discord/callback')}&response_type=code&scope=identify&state=${encodeURIComponent(location)}`;
    window.location.href = loginUrl;
    return null;
  }

  return <Route path={path} component={Component} />;
}