# GifGetter Discord Bot Website

A modern web application for the GifGetter Discord bot that provides an enhanced user experience through Discord OAuth authentication and interactive features.

## Features
- Discord OAuth Integration - Securely login with your Discord account
- User Feedback System - Share your thoughts and suggestions
- Responsive Design with Dark Mode - Beautiful interface that works on all devices
- Interactive Animations - Engaging user experience with smooth transitions
- GIF Showcase Gallery - Browse converted GIFs and examples

## Setup Instructions

1. Install the Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Initialize your Amplify project:
```bash
amplify init
```

3. Add API with GraphQL:
```bash
amplify add api
# Choose GraphQL when prompted
# Use the schema from schema.graphql when asked
```

4. Add auth for Discord OAuth:
```bash
amplify add auth
# Choose social provider and select Discord
```

5. Add storage for GIFs:
```bash
amplify add storage
# Choose S3 when prompted
```

6. Push all services:
```bash
amplify push
```

## Development

```bash
npm install
npm run dev
```

Built with React, Tailwind CSS, and powered by AWS Amplify and Discord's OAuth system.