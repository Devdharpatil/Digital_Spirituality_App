# Implementation Details

This document outlines how each requirement in the Ahoum Digital Guide App front-end technical challenge has been implemented.

## Core Features Implementation

### 1. Navigation
- Implemented a bottom tab navigation with 5 icons using React Navigation's bottom tab navigator
- Each tab (Home, Explore, Chat, Saved, Profile) has a distinct icon
- Active tab is highlighted with the primary color
- Navigation is wrapped in a proper NavigationContainer with SafeAreaProvider

### 2. Home Screen
- Created a scrollable home screen displaying 4 "cards" with various content
- Each card has:
  - Consistent padding
  - Rounded corners
  - Sample image
  - Title and description
- The screen is scrollable when content exceeds the viewport
- Uses a reusable Card component for consistency

### 3. Mascot
- Implemented a floating mascot using the provided blue pet image
- The mascot shows thought bubbles with guide information when tapped
- The mascot explains different elements of the screen depending on context
- Interactive: can be tapped and dragged around the screen
- Fluid movement using React Native Reanimated

### 4. Styling
- Used Tailwind CSS approach with the twrnc library
- Implemented a dark background with a custom theme
- Added soft gradients to the card components
- Consistent spacing and typography throughout the app

## Bonus Features Implementation

### 1. Animated Mascot
- Added subtle bobbing animation using React Native Reanimated
- Implemented a pulsing effect for the mascot
- Created smooth movement animations when the mascot is dragged
- Transitions for thought bubbles appearing and disappearing

### 2. State Management
- Implemented Zustand for state management
- Created a mascot store to handle:
  - Current dialog content
  - Mascot position and visibility
  - Target element being explained
  - Animation state

## Project Structure

The project follows a clean and organized structure:

1. `src/components`: Reusable UI components like Card and Mascot
2. `src/screens`: Screen components for each tab
3. `src/navigation`: Navigation configuration
4. `src/store`: Zustand store for state management
5. `src/theme`: Tailwind configuration and theme settings
6. `src/assets`: Static assets including the mascot image

## Technical Decisions

1. **Pure React Native CLI**: Used pure React Native CLI without Expo as required
2. **TypeScript**: Added TypeScript support for better type safety and developer experience
3. **Zustand**: Chosen for state management due to its simplicity and small bundle size
4. **React Native Reanimated**: Used for performant animations
5. **React Native Gesture Handler**: Implemented for smooth drag interactions with the mascot

## Screenshots/Screen Recording

Screenshots and screen recordings should be added to showcase:
1. The navigation with active tab highlighting
2. Home screen cards
3. Mascot with thought bubble guides
4. Animation of mascot in action 