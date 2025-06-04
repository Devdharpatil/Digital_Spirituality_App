import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Single particle component
const Particle = ({ delay, size, startPosition, duration, color }) => {
  const translateX = useSharedValue(startPosition.x);
  const translateY = useSharedValue(startPosition.y);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Start animation after delay
    setTimeout(() => {
      // Fade in
      opacity.value = withTiming(0.7, { duration: 400 });
      scale.value = withTiming(1, { duration: 400 });
      
      // Move in a curved path
      translateX.value = withTiming(startPosition.x + (Math.random() * 200 - 100), { 
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      translateY.value = withTiming(startPosition.y - (100 + Math.random() * 200), { 
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Fade out at the end
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400 });
        scale.value = withTiming(0, { duration: 400 });
      }, duration - 400);
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

// Star-like particle for more spiritual feel
const StarParticle = ({ delay, size, startPosition, duration, color }) => {
  const translateX = useSharedValue(startPosition.x);
  const translateY = useSharedValue(startPosition.y);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      // Fade in
      opacity.value = withTiming(0.8, { duration: 400 });
      scale.value = withTiming(1, { duration: 400 });
      
      // Rotation
      rotate.value = withRepeat(
        withTiming(6.28, { duration: 3000 }),
        -1,
        false
      );
      
      // Move in a gentle path
      translateX.value = withTiming(startPosition.x + (Math.random() * 100 - 50), { 
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      translateY.value = withTiming(startPosition.y - (50 + Math.random() * 100), { 
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Pulse size
      scale.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(1.2, { duration: 1500 })
        ),
        -1,
        true
      );
      
      // Fade out at the end
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 600 });
      }, duration - 600);
    }, delay);
  }, []);

  const starStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotate.value}rad` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.star,
        starStyle,
      ]}
    >
      <View style={[styles.starCore, { backgroundColor: color }]} />
      <View style={[styles.starRay, { backgroundColor: color, transform: [{ rotate: '0deg' }] }]} />
      <View style={[styles.starRay, { backgroundColor: color, transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.starRay, { backgroundColor: color, transform: [{ rotate: '90deg' }] }]} />
      <View style={[styles.starRay, { backgroundColor: color, transform: [{ rotate: '135deg' }] }]} />
    </Animated.View>
  );
};

const TransitionParticles = () => {
  const [particles, setParticles] = useState([]);
  const [stars, setStars] = useState([]);
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in the container
    containerOpacity.value = withTiming(1, { duration: 500 });
    
    // Create particles with different properties
    const newParticles = [];
    const numParticles = 30;
    
    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: i,
        delay: Math.random() * 2000,
        size: 3 + Math.random() * 7,
        startPosition: {
          x: Math.random() * width,
          y: height + Math.random() * 50, // Start from bottom
        },
        duration: 3000 + Math.random() * 4000,
        color: [
          '#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7', 
          '#FFA500', '#FFFF00', '#4cc9f0'
        ][Math.floor(Math.random() * 8)],
      });
    }
    
    setParticles(newParticles);
    
    // Create star particles
    const newStars = [];
    const numStars = 15;
    
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: i,
        delay: Math.random() * 2500,
        size: 5 + Math.random() * 10,
        startPosition: {
          x: Math.random() * width,
          y: Math.random() * height, // Randomly placed
        },
        duration: 5000 + Math.random() * 5000,
        color: [
          '#ffffff', '#a5b4fc', '#c4b5fd', '#fef08a', '#bae6fd'
        ][Math.floor(Math.random() * 5)],
      });
    }
    
    setStars(newStars);
    
    // Set up particle regeneration
    const interval = setInterval(() => {
      setParticles(prevParticles => {
        const newParticles = [...prevParticles];
        
        // Add a new particle to replace one that has faded out
        newParticles.push({
          id: Date.now(),
          delay: 0,
          size: 3 + Math.random() * 7,
          startPosition: {
            x: Math.random() * width,
            y: height + Math.random() * 50,
          },
          duration: 3000 + Math.random() * 4000,
          color: [
            '#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7', 
            '#FFA500', '#FFFF00', '#4cc9f0'
          ][Math.floor(Math.random() * 8)],
        });
        
        // Keep only the latest 30 particles to avoid performance issues
        if (newParticles.length > 30) {
          newParticles.shift();
        }
        
        return newParticles;
      });
      
      // Occasionally add a new star
      if (Math.random() > 0.7) {
        setStars(prevStars => {
          const newStars = [...prevStars];
          
          newStars.push({
            id: Date.now() + 1000,
            delay: 0,
            size: 5 + Math.random() * 10,
            startPosition: {
              x: Math.random() * width,
              y: Math.random() * height,
            },
            duration: 5000 + Math.random() * 5000,
            color: [
              '#ffffff', '#a5b4fc', '#c4b5fd', '#fef08a', '#bae6fd'
            ][Math.floor(Math.random() * 5)],
          });
          
          // Keep only the latest 15 stars
          if (newStars.length > 15) {
            newStars.shift();
          }
          
          return newStars;
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value
    };
  });

  return (
    <Animated.View 
      style={[styles.container, containerStyle]}
      entering={FadeIn.duration(600)}
    >
      {particles.map(particle => (
        <Particle
          key={particle.id}
          delay={particle.delay}
          size={particle.size}
          startPosition={particle.startPosition}
          duration={particle.duration}
          color={particle.color}
        />
      ))}
      
      {stars.map(star => (
        <StarParticle
          key={star.id}
          delay={star.delay}
          size={star.size}
          startPosition={star.startPosition}
          duration={star.duration}
          color={star.color}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    zIndex: 1000,
  },
  star: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  starCore: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  starRay: {
    position: 'absolute',
    width: 2,
    height: 20,
  }
});

export default TransitionParticles; 