# GifGetter Discord Bot Website

A modern web application for the GifGetter Discord bot that provides an enhanced user experience through Discord OAuth authentication and interactive features.

## Features
- Discord OAuth Integration - Securely login with your Discord account
- User Feedback System - Share your thoughts and suggestions
- Responsive Design with Dark Mode - Beautiful interface that works on all devices
- Interactive Animations - Engaging user experience with smooth transitions
- GIF Showcase Gallery - Browse converted GIFs and examples

## Development

```bash
npm install
npm run dev
```

## Backend Structure

The application uses:
- Express server for the backend
- Discord OAuth for authentication
- PostgreSQL for data persistence
- Memory session store for development

### Authentication Flow
1. User clicks "Login with Discord"
2. Discord handles OAuth flow
3. On success, user is redirected back with tokens
4. Frontend receives authenticated user session

Built with React, Tailwind CSS, and powered by Discord's OAuth system.