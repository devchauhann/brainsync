# BrainSync


A comprehensive CSE (Computer Science Engineering) app built with React, TypeScript, and Capacitor for cross-platform mobile development.

## Features

- Cross-platform mobile app (iOS & Android)
- Modern React with TypeScript
- Capacitor integration for native functionality
- Responsive design with mobile-first approach

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (if applicable)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. For mobile development:
   ```bash
   npm run build
   npx cap sync
   npx cap open android  # for Android
   npx cap open ios      # for iOS
   ```

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Mobile:** Capacitor
- **Build Tool:** Vite
- **Package Manager:** npm

## Project Structure

```
src/
├── components/          # React components
├── mobile-utils.ts      # Mobile utility functions
└── ...

android/                 # Android platform files
public/                  # Static assets
```

## Development

This app is designed to work both as a web application and as a native mobile app through Capacitor.

View the original AI Studio app: https://ai.studio/apps/drive/1PfyPcfz5SmQgaCjFIDfrQrjUUiWTFuW5
