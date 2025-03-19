# GifGetter Discord Bot Website

A modern web application for the GifGetter Discord bot that provides an enhanced user experience through Discord OAuth authentication and interactive features.

## Features
- Discord OAuth Integration - Securely login with your Discord account
- User Feedback System - Share your thoughts and suggestions
- Web Converter - Convert videos to GIFs through the website itself
- Responsive Design with Dark Mode - Beautiful interface that works on all devices
- Interactive Animations - Engaging user experience with smooth transitions

## Development

```bash
npm install
npm run dev
```

## Backend Structure

The application uses AWS S3 for video/GIF storage.

### GraphQL Schema
The main entities in our schema:
- User: Stores Discord user information
- Feedback: Stores user feedback and suggestions
- GIF: Stores information about converted GIFs


### Authentication Flow
1. User clicks "Login with Discord"
2. Discord handles OAuth flow
3. On success, user is redirected back with tokens
4. Frontend receives authenticated user session


Built with React, Tailwind CSS, and powered by Discord's OAuth system.