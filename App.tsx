/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation';
import tw from './src/theme/tailwind';
import 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';

// Ensure that you have this import at the top level of your app
import { LogBox, StatusBar } from 'react-native';

// Ignore specific Reanimated-related warnings if any appear
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Non-serializable values were found in the navigation state',
]);

function App(): React.JSX.Element {
  useEffect(() => {
    // Hide native splash screen (if used)
    try {
      SplashScreen.hide();
    } catch (error) {
      console.log('SplashScreen not available');
    }
  }, []);

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      {/* Set status bar to dark content for better visibility */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1a1a2e" 
        translucent 
      />
      <Navigation />
    </GestureHandlerRootView>
  );
}

export default App;
