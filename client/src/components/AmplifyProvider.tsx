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

      // Configure Amplify
      const config = {
        Auth: {
          region: 'us-east-1',
          oauth: {
            domain: 'discord.com/api/oauth2/authorize',
            scope: ['identify', 'email'],
            redirectSignIn: 'http://localhost:5000/api/auth/discord/callback',
            redirectSignOut: 'http://localhost:5000',
            responseType: 'code',
            clientId: import.meta.env.VITE_DISCORD_CLIENT_ID
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