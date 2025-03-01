# GifGetter Discord Bot Website

A modern web application for the GifGetter Discord bot that provides an enhanced user experience through Discord OAuth authentication and interactive features.

## Features
- Discord OAuth Integration
- User Feedback System
- Responsive Design with Dark Mode
- Interactive Animations
- GIF Showcase Gallery

## Deployment Guide

### Prerequisites
1. AWS Account with Amplify access
2. Discord Application (from Discord Developer Portal)
3. Node.js and npm installed locally

### AWS Amplify Deployment Steps

1. **Initial Setup**
   - Fork/clone this repository
   - Install AWS Amplify CLI: `npm install -g @aws-amplify/cli`
   - Configure AWS credentials: `amplify configure`

2. **Environment Variables**
   Set up the following environment variables in AWS Amplify Console:
   ```
   VITE_DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   SESSION_SECRET=your_session_secret
   NODE_ENV=production
   ```

3. **Build Settings**
   Create `amplify.yml` in your repository:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Discord OAuth Configuration**
   After deploying:
   - Get your Amplify domain (e.g., `https://main.d123xyz.amplifyapp.com`)
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Select your application
   - Go to OAuth2 settings
   - Add redirect URL: `https://your-amplify-domain/api/auth/discord/callback`

5. **Deploy**
   - Connect your repository to AWS Amplify
   - Choose the main branch for deployment
   - Configure build settings using the `amplify.yml` above
   - Add environment variables
   - Deploy!

6. **Verify Deployment**
   - Visit your Amplify domain
   - Test Discord login
   - Verify feedback submission works
   - Check dark mode toggle
   - Test responsive design on mobile

### Post-Deployment

1. **Custom Domain (Optional)**
   - In AWS Amplify Console, go to "Domain Management"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Monitoring**
   - Monitor application logs in AWS Amplify Console
   - Check CloudWatch for detailed metrics
   - Set up alerts for error rates or performance issues

### Troubleshooting

1. **Build Issues**
   - Check build logs in Amplify Console
   - Verify environment variables are set correctly
   - Ensure all dependencies are installed

2. **OAuth Issues**
   - Verify Discord OAuth redirect URI matches your domain
   - Check environment variables are properly set
   - Look for CORS-related errors in browser console

3. **Performance Issues**
   - Enable AWS CloudFront CDN
   - Check browser console for performance warnings
   - Monitor AWS Amplify metrics

For additional support or questions, please open an issue in the repository.