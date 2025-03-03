#!/bin/bash

# Exit on error
set -e

echo "Initializing Amplify backend services..."

# Initialize Amplify with explicit AWS credentials
amplify init \
  --amplify "{\"projectName\":\"gifgetter\"}" \
  --frontend "{\"framework\":\"react\",\"config\":{\"SourceDir\":\"client/src\",\"DistributionDir\":\"dist/public\",\"BuildCommand\":\"npm run build\",\"StartCommand\":\"npm run dev\"}}" \
  --providers "{\"awscloudformation\":{\"configLevel\":\"project\",\"useProfile\":false,\"accessKeyId\":\"$AWS_ACCESS_KEY_ID\",\"secretAccessKey\":\"$AWS_SECRET_ACCESS_KEY\",\"region\":\"us-east-1\"}}" \
  --yes

# Add API
amplify add api \
  --apiName gifgetterapi \
  --serviceType GraphQL \
  --defaultAuthType "Amazon Cognito User Pool" \
  --schemaPath "./shared/schema.graphql" \
  --conflictResolution "AUTO_MERGE" \
  --yes

# Add Auth with Discord OAuth
amplify add auth \
  --serviceName gifgetterauth \
  --providerPlugin cognito \
  --requireMFA false \
  --usernameAttributes email \
  --socialProviders discord \
  --yes

# Add Storage
amplify add storage \
  --serviceName gifgettercontent \
  --bucketName gifgetter-content \
  --storageAccess "auth" \
  --yes

echo "Backend services initialized. Run 'amplify push' to deploy."