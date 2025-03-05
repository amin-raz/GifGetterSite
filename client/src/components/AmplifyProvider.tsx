import { ReactNode } from 'react';

export function AmplifyProvider({ children }: { children: ReactNode }) {
  // Simply render children without any Amplify configuration
  // since we're using Passport for authentication
  return <>{children}</>;
}