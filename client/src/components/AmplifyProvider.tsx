import { ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function AmplifyProvider({ children }: { children: ReactNode }) {
  // Configure Amplify with minimal settings
  Amplify.configure({
    Auth: {
      region: 'us-east-1'
    }
  });

  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}