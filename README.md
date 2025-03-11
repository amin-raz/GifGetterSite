# GifGetter Discord Bot Website

A modern web application for the GifGetter Discord bot that provides an enhanced user experience through Discord OAuth authentication and interactive features.

## Features
- Discord OAuth Integration - Securely login with your Discord account
- User Feedback System - Share your thoughts and suggestions
- Responsive Design with Dark Mode - Beautiful interface that works on all devices
- Interactive Animations - Engaging user experience with smooth transitions
- GIF Showcase Gallery - Browse converted GIFs and examples

## Backend Structure

The application uses AWS S3 storage for video/GIF storage.

### GraphQL Schema
The main entities in our schema:
- User: Stores Discord user information
- Feedback: Stores user feedback and suggestions
- GIF: Stores information about converted GIFs

### Authentication Flow
1. User clicks "Login with Discord"
2. Cognito handles OAuth flow with Discord
3. On success, user is redirected back with tokens
4. Frontend receives authenticated user session

Built with React, Tailwind CSS, and powered by AWS Amplify and Discord's OAuth system.
