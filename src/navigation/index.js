import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import TransitionParticles from '../components/TransitionParticles';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

const Navigation = () => {
  // State to control whether to show the splash screen
  const [showSplash, setShowSplash] = useState(true);
  // State to control whether to show transition particles
  const [showParticles, setShowParticles] = useState(false);
  // State to ensure main content is ready before splash disappears
  const [mainContentReady, setMainContentReady] = useState(false);
  
  // Animation values for the main content
  const mainContentOpacity = useSharedValue(0);
  const mainContentScale = useSharedValue(0.95);

  // Prepare the main content before splash screen finishes
  useEffect(() => {
    // Pre-load the main content while splash is still visible
    if (showSplash) {
      setTimeout(() => {
        setMainContentReady(true);
      }, 1000); // Start preparing main content after 1 second
    }
  }, [showSplash]);

  // Function to hide the splash screen with a smooth transition
  const hideSplash = () => {
    // Ensure main content is ready
    if (!mainContentReady) {
      setMainContentReady(true);
    }
    
    // Show magical particles for the transition
    setShowParticles(true);
    
    // Start the fade-in animation for the main content
    mainContentOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
    
    // Scale up the main content
    mainContentScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
    
    // Set a short delay before hiding splash to ensure smooth transition
    setTimeout(() => {
      // Hide the splash screen after main content starts to appear
      setShowSplash(false);
      
      // Hide particles as soon as the transition is complete
      setTimeout(() => {
        setShowParticles(false);
      }, 800); // Hide particles shortly after transition completes
    }, 100);
  };
  
  // Animated style for the main content
  const mainContentStyle = useAnimatedStyle(() => {
    return {
      opacity: mainContentOpacity.value,
      transform: [{ scale: mainContentScale.value }],
      flex: 1,
    };
  });

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer>
          {/* Main content - always rendered but initially invisible */}
          <Animated.View 
            style={[
              mainContentStyle, 
              styles.mainContent,
              { display: mainContentReady ? 'flex' : 'none' }
            ]}
          >
            <BottomTabNavigator />
          </Animated.View>
          
          {/* Splash screen - rendered on top initially */}
          {showSplash && <SplashScreen onFinished={hideSplash} />}
          
          {/* Transition particles - shown only during the transition */}
          {showParticles && <TransitionParticles />}
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Match the splash screen background
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Match the splash screen background
  }
});

export default Navigation; 