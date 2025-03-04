import { ReactNode, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Gen 2 configuration
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';

export function AmplifyProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      // Enable debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Configuring Amplify in development mode with debug logging');
      }

      // Configure Amplify
      const config = {
        Auth: {
          region: 'us-east-1',
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
          oauth: {
            domain: `${process.env.COGNITO_DOMAIN}.auth.us-east-1.amazoncognito.com`,
            scope: ['email', 'openid', 'profile'],
            redirectSignIn: window.location.origin,
            redirectSignOut: window.location.origin,
            responseType: 'code',
            providers: ['Discord']
          }
        },
        Storage: {
          AWSS3: {
            bucket: 'gifgetter-content',
            region: 'us-east-1'
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