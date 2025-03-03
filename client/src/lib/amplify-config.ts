import { Amplify } from 'aws-amplify';

// Storage configuration for S3
const storageConfig = {
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: 'us-east-1'
  },
  Storage: {
    AWSS3: {
      bucket: 'gifgetter-content',
      region: 'us-east-1'
    }
  }
};

try {
  // First try to load the auto-generated config
  const awsconfig = require('../aws-exports').default;
  Amplify.configure(awsconfig);
} catch (error) {
  // Fall back to manual configuration if aws-exports.js is not available
  console.warn('AWS configuration not found, using manual configuration');
  Amplify.configure(storageConfig);
}

export default Amplify;