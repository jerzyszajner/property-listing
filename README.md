# Property Listing App

**Live Demo:** [property-listing-react.netlify.app](https://property-listing-react.netlify.app/)

Modern property listing application built with React and TypeScript. Browse and filter vacation rentals by location, guest capacity, and superhost status.

## Features

- Filter by location, guest count, and superhost status
- Responsive design with modern UI
- Performance-optimized with memoized filtering hooks
- Type-safe with TypeScript
- Property data stored in Firebase Firestore

## Tech Stack

- React 19 + TypeScript
- Vite
- CSS Modules
- Custom React Hooks
- Firebase (Firestore)
- [Lucide React](https://lucide.dev) - Icon library
- [clsx](https://github.com/lukeed/clsx) - Conditional classnames utility

## Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/) and enable Firestore.
2. Copy the web app config from **Project settings → General**.
3. Create `.env.local` and add:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_MAPS_API_KEY
   ```

## Getting Started

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
