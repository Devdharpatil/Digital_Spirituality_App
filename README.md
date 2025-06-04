# Digital Spirituality App

A lightweight mobile app with an interactive digital guide mascot that helps users navigate through their spiritual journey.

## Features

- Interactive floating mascot guide that provides contextual information
- Smooth animations with gesture-controlled mascot
- Bottom tab navigation with 5 tabs (Home, Explore, Chat, Saved, Profile)
- Home screen with inspirational spiritual content cards
- Dynamic theme with Tailwind CSS styling
- Contextual help and guidance throughout the app
- Chat interface for spiritual discussions
- Personalized profile management
- Saved content functionality for spiritual resources
- Explore section for discovering new spiritual content

## Tech Stack

- React Native (CLI) - No Expo
- Tailwind CSS (using twrnc)
- JavaScript
- React Navigation for navigation
- Zustand for state management
- React Native Reanimated for fluid animations
- React Native Gesture Handler for interactive elements

## Getting Started

### Prerequisites

- Node.js (>= 18)
- npm or yarn
- React Native CLI
- Android Studio and/or Xcode
- JDK 11 or newer

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd AhoumDigitalGuide
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Install pods for iOS:

```bash
cd ios && pod install && cd ..
```

### Running the App

#### Android

```bash
npm run android
# or
yarn android
```

#### iOS

```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
Project/
├── src/
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable UI components including the interactive mascot
│   ├── navigation/     # Navigation configuration with bottom tabs
│   ├── screens/        # Screen components for all main app sections
│   ├── store/          # Zustand store for state management
│   └── theme/          # Styling and theme configuration with Tailwind
├── App.tsx             # Main app component
└── index.js           # App entry point
```

## Key Features Explained

### Interactive Mascot Guide
A floating, animated mascot that users can interact with throughout the app. It provides contextual guidance, responds to user actions, and can be dragged around the screen.

### Spiritual Content Cards
The home screen displays inspirational cards with spiritual content, daily inspiration, meditation guides, and mindfulness practices.

### Animated Navigation
Custom animated bottom tab navigation with fluid transitions and visual feedback for a better user experience.

### Responsive Design
The app adapts to different screen sizes while maintaining an intuitive and engaging user interface.

### State Management
Uses Zustand for efficient state management, particularly for handling the mascot's position, dialog content, and animation states.

## Design Philosophy

The app is designed to create a seamless and intuitive spiritual journey for users. The interactive mascot serves as a guide that provides contextual information and assistance when needed, making the app accessible to users of all experience levels.
