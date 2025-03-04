import { ReactNode, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function AmplifyProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      // Enable debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Configuring Amplify in development mode');
      }

      // Configure Amplify with Discord OAuth
      const config = {
        Auth: {
          region: 'us-east-1',
          // We'll use environment variables for these values
          oauth: {
            domain: import.meta.env.VITE_AUTH_DOMAIN,
            scope: ['identify', 'email'],
            redirectSignIn: window.location.origin,
            redirectSignOut: window.location.origin,
            responseType: 'code',
            clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
            clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET //Corrected typo here
          }
        }
      };

      Amplify.configure(config);
      console.log('Amplify configuration complete');
    } catch (error) {
      console.error('Error configuring Amplify:', error);
    }
  }, []);

  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}