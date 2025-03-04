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

# Add Auth with Discord OAuth
amplify add auth \
  --service "Cognito" \
  --serviceName "gifgetterauth" \
  --providerPlugin "awscloudformation" \
  --requireMFA false \
  --usernameAttributes "email" \
  --allowUnauthenticatedIdentities false \
  --oAuth "{\"CallbackURLs\":[\"http://localhost:5000/\"],\"LogoutURLs\":[\"http://localhost:5000/\"],\"AllowedOAuthFlows\":[\"code\"],\"AllowedOAuthScopes\":[\"email\",\"openid\",\"profile\"],\"socialProviders\":[\"discord\"]}" \
  --yes

# Add Storage
amplify add storage \
  --service "S3" \
  --resourceName "gifgettercontent" \
  --bucketName "gifgetter-content" \
  --storageAccess "auth" \
  --yes

echo "Backend services initialized. Run 'amplify push' to deploy."