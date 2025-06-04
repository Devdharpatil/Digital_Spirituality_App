import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
  FadeOut,
  FadeIn,
} from 'react-native-reanimated';
import tw from '../theme/tailwind';

const { width, height } = Dimensions.get('window');

// Magical particle component
const MagicParticle = ({ delay, size, startPosition, duration, color }) => {
  const translateX = useSharedValue(startPosition.x);
  const translateY = useSharedValue(startPosition.y);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Start animation after delay
    setTimeout(() => {
      // Fade in
      opacity.value = withTiming(0.8, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
      
      // Move in a curved path
      translateX.value = withTiming(startPosition.x + (Math.random() * 100 - 50), { 
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      translateY.value = withTiming(startPosition.y - (50 + Math.random() * 100), { 
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Fade out at the end
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0, { duration: 300 });
      }, duration - 300);
    }, delay);
  }, []);

  const particleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.particle,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: color,
        },
        particleStyle,
      ]} 
    />
  );
};

const SplashScreen = ({ onFinished }) => {
  // Animation values
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Animation for the glowing effect
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  
  // Animation for screen transition
  const screenOpacity = useSharedValue(1);
  
  // Particles state
  const [particles, setParticles] = useState([]);
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [titleScale, setTitleScale] = useState(0.95);
  
  // State for handling the two-part title animation
  const [digitalOpacity, setDigitalOpacity] = useState(0);

  useEffect(() => {
    // Create magic particles
    const newParticles = [];
    const numParticles = 25;
    
    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: i,
        delay: 800 + Math.random() * 1000,
        size: 4 + Math.random() * 8,
        startPosition: {
          x: -30 + Math.random() * 60,
          y: -10 + Math.random() * 20,
        },
        duration: 1500 + Math.random() * 1000,
        color: [
          '#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7', 
          '#FFA500', '#FFFF00', '#4cc9f0'
        ][Math.floor(Math.random() * 8)],
      });
    }
    
    setParticles(newParticles);

    // Start the splash screen animation sequence
    const startAnimations = () => {
      // Fade in
      opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
      
      // Scale up with a bounce effect
      scale.value = withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.cubic) })
      );
      
      // Subtle rotation animation
      rotate.value = withSequence(
        withTiming(-0.1, { duration: 400 }),
        withTiming(0.1, { duration: 800 }),
        withTiming(0, { duration: 400 })
      );
      
      // Floating effect
      translateY.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.cubic) })
        ),
        2,
        true
      );
      
      // Glow animation
      glowOpacity.value = withDelay(400, withTiming(0.8, { duration: 1000 }));
      glowScale.value = withSequence(
        withDelay(400, withTiming(1.2, { duration: 1000 })),
        withTiming(1.4, { duration: 1000 })
      );

      // Fade in the title with a scale effect
      setTimeout(() => {
        setTitleOpacity(1);
        setTitleScale(1);
        
        // After a short delay, reveal the "Digital" part
        setTimeout(() => {
          setDigitalOpacity(1);
        }, 500);
      }, 1000);
      
      // Magical exit animation - fade out with scale and particles
      setTimeout(() => {
        // Scale up the glow as we fade out
        glowScale.value = withTiming(2, { duration: 600 });
        glowOpacity.value = withTiming(0.2, { duration: 600 });
        
        // Fade out the entire screen
        screenOpacity.value = withTiming(0, { 
          duration: 800,
          easing: Easing.inOut(Easing.cubic)
        }, () => {
          runOnJS(onFinished)();
        });
        
        // Scale up the mascot slightly
        scale.value = withTiming(1.3, { duration: 700 });
        
        // Fade out the mascot
        opacity.value = withTiming(0, { duration: 700 });
      }, 3200);
    };

    startAnimations();
  }, []);

  // Animated styles for the mascot
  const mascotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}rad` },
      ],
      opacity: opacity.value,
    };
  });

  // Animated styles for the glow effect
  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      transform: [{ scale: glowScale.value }],
    };
  });
  
  // Animated style for the entire screen for exit animation
  const screenAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: screenOpacity.value,
    };
  });

  return (
    <Animated.View style={[tw`flex-1 items-center justify-center`, styles.container, screenAnimatedStyle]}>
      <View style={styles.logoContainer}>
        {/* Particles */}
        {particles.map((particle) => (
          <MagicParticle
            key={particle.id}
            delay={particle.delay}
            size={particle.size}
            startPosition={particle.startPosition}
            duration={particle.duration}
            color={particle.color}
          />
        ))}
        
        {/* Glow effect */}
        <Animated.View style={[styles.glow, glowAnimatedStyle]} />
        
        {/* Mascot image */}
        <Animated.Image
          source={require('../assets/mascot.png')}
          style={[styles.logo, mascotAnimatedStyle]}
          resizeMode="contain"
        />
      </View>
      
      {/* App title with two-part styling */}
      <View style={styles.titleContainer}>
        <Animated.Text 
          style={[
            styles.titleSpiritual,
            { 
              opacity: titleOpacity,
              transform: [{ scale: titleScale }]
            }
          ]}
        >
          Spiritual
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.titleDigital,
            { 
              opacity: digitalOpacity,
            }
          ]}
        >
          Digital Guide
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e', // Dark background color
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 180, // Smaller circle
    height: 180, // Smaller circle
  },
  logo: {
    width: 120, // Smaller mascot
    height: 120, // Smaller mascot
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    width: 180, // Smaller glow circle
    height: 180, // Smaller glow circle
    borderRadius: 90, // Half of width/height
    backgroundColor: '#4361ee',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    zIndex: 3,
  },
  titleContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  titleSpiritual: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '500', // Medium weight for professionalism
    letterSpacing: 1.5, // More subtle spacing for elegance
    textAlign: 'center',
    textShadowColor: 'rgba(67, 97, 238, 0.4)', // Subtle shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    fontFamily: 'System',
  },
  titleDigital: {
    color: '#e2e8f0', // Lighter color that's more professional
    fontSize: 22, // Smaller size for hierarchy
    fontWeight: '400', // Regular weight for balance
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(67, 97, 238, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginTop: 8, // Space between the two lines
    fontFamily: 'System',
  }
});

export default SplashScreen; 