#!/bin/bash

# Exit on error
set -e

echo "Initializing Amplify backend services..."

# Initialize Amplify
amplify init \
  --amplify "{\"projectName\":\"gifgetter\"}" \
  --frontend "{\"framework\":\"react\",\"config\":{\"SourceDir\":\"client/src\",\"DistributionDir\":\"dist/public\",\"BuildCommand\":\"npm run build\",\"StartCommand\":\"npm run dev\"}}" \
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
