import { ReactNode, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Gen 2 configuration
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';

export function AmplifyProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Amplify will auto-configure from the generated aws-exports.js
    // after running 'amplify push'
    try {
      const awsconfig = require('../aws-exports').default;
      Amplify.configure(awsconfig);
    } catch (error) {
      console.warn('AWS configuration not found. Run amplify push to generate configuration.');
    }
  }, []);

  return children;
}