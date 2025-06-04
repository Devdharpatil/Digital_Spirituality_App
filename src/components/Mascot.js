import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import tw from '../theme/tailwind';
import useMascotStore from '../store/mascotStore';

// Get screen dimensions for positioning
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Constants for dimensions
const BUBBLE_WIDTH = 240;
const BUBBLE_HEIGHT = 150;
const MASCOT_SIZE = 64;
const NAV_BAR_HEIGHT = 60;  // Estimated navigation bar height

// Hard-coded positions for each step
const STEP_POSITIONS = {
  welcome: { x: 30, y: 140 },         // Initial position - top left  
  card: { x: 181, y: 182 },  // Centered on the post card image
  like: { x: 307, y: 250 },  // Better position for like button
  bookmark: { x: 347, y: 250 }, // Better position for bookmark button
  menu: { x: 347, y: 85 },  // Better position for three-dot menu
  finish: { x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - NAV_BAR_HEIGHT - MASCOT_SIZE} // Bottom right above nav bar
};

// Define bubble positions for each step
const BUBBLE_POSITIONS = {
  welcome: 'right',   // Dialog to the right of mascot
  card: 'bottom',     // Dialog symmetrically below mascot 
  like: 'left',       // Dialog to the left of mascot
  bookmark: 'left',   // Dialog to the left of mascot
  menu: 'left',       // Dialog to the left of mascot
  finish: null        // No dialog
};

// Define hardcoded positions for dialog boxes and arrows
const HARDCODED_DIALOG_POSITIONS = {
  // Step 1 - Card
  card: {
    dialog: {
      top: 84,
      left: -90,
      width: BUBBLE_WIDTH
    },
    arrow: {
      top: -15,
      left: 114,
      transform: [{ rotate: '45deg' }]
    }
  },
  // Step 2 - Like
  like: {
    dialog: {
      top: -30,
      left: -261,
      width: BUBBLE_WIDTH
    },
    arrow: {
      right: -18,
      top: 54,
      transform: [{ rotate: '45deg' }]
    }
  }
};

const ThoughtBubble = ({ text, step, totalSteps, onNextStep, onPrevStep, currentStepName, mascotPosition }) => {
  if (!text) return null;
  
  // Animation values for the bubble
  const bubbleScale = useSharedValue(0.8);
  
  // Get the intended bubble position for the current step
  const getBubblePosition = () => {
    // Check if we have hardcoded positions for this step
    if (HARDCODED_DIALOG_POSITIONS[currentStepName]) {
      console.log(`Using hardcoded position for ${currentStepName}`);
      return {
        bubbleStyle: HARDCODED_DIALOG_POSITIONS[currentStepName].dialog,
        arrowStyle: HARDCODED_DIALOG_POSITIONS[currentStepName].arrow
      };
    }
    
    // If no hardcoded position, fall back to dynamic positioning
    const { x, y } = mascotPosition;
    
    // Default positions and arrow settings
    let bubbleStyle = {};
    let arrowStyle = {};
    
    // Get preferred position based on step name
    let preferredPosition = BUBBLE_POSITIONS[currentStepName] || 'right';
    
    // Check if the bubble would go off-screen and adjust position if needed
    if (preferredPosition === 'right' && (x + MASCOT_SIZE + BUBBLE_WIDTH > SCREEN_WIDTH - 20)) {
      preferredPosition = 'left';
    } else if (preferredPosition === 'left' && (x - BUBBLE_WIDTH < 20)) {
      preferredPosition = 'bottom';
    }
    
    switch(preferredPosition) {
      case 'left':
        // Position to the left of the mascot
        bubbleStyle = {
          top: -BUBBLE_HEIGHT / 2 + MASCOT_SIZE / 2,
          right: MASCOT_SIZE - 5,
          width: BUBBLE_WIDTH,
        };
        arrowStyle = {
          right: -8,
          top: BUBBLE_HEIGHT / 2 - 8,
          transform: [{ rotate: '45deg' }],
        };
        break;
        
      case 'right':
        // Position to the right of the mascot
        bubbleStyle = {
          top: -BUBBLE_HEIGHT / 2 + MASCOT_SIZE / 2,
          left: MASCOT_SIZE - 5,
          width: BUBBLE_WIDTH,
        };
        arrowStyle = {
          left: -8,
          top: BUBBLE_HEIGHT / 2 - 8,
          transform: [{ rotate: '45deg' }],
        };
        break;
        
      case 'bottom':
        // Position below the mascot, perfectly centered
        const centerPosition = x + (MASCOT_SIZE / 2);
        // Apply leftward adjustment to compensate for observed right-shift
        let leftOffset = centerPosition - (BUBBLE_WIDTH / 2) - 25; // Shift left by 25 pixels
        
        // Adjust if it would go off screen left or right
        if (leftOffset < 10) {
          leftOffset = 10;
        } else if (leftOffset + BUBBLE_WIDTH > SCREEN_WIDTH - 10) {
          leftOffset = SCREEN_WIDTH - 10 - BUBBLE_WIDTH;
        }
        
        bubbleStyle = {
          top: MASCOT_SIZE,
          left: leftOffset,
          width: BUBBLE_WIDTH,
        };
        
        // Position arrow to point directly at mascot center
        const arrowLeftPos = centerPosition - leftOffset - 8;
        arrowStyle = {
          top: -8,
          left: Math.max(16, Math.min(BUBBLE_WIDTH - 16, arrowLeftPos)),
          transform: [{ rotate: '45deg' }],
        };
        break;
        
      case 'top':
        // Position above the mascot
        leftOffset = -BUBBLE_WIDTH / 2 + MASCOT_SIZE / 2;
        
        // Adjust if it would go off screen left or right
        if (x + leftOffset < 10) {
          leftOffset = -x + 10;
        } else if (x + leftOffset + BUBBLE_WIDTH > SCREEN_WIDTH - 10) {
          leftOffset = SCREEN_WIDTH - 10 - BUBBLE_WIDTH - x;
        }
        
        bubbleStyle = {
          bottom: MASCOT_SIZE,
          left: leftOffset,
          width: BUBBLE_WIDTH,
        };
        
        // Position arrow to point at mascot
        const arrowLeftPos2 = BUBBLE_WIDTH / 2 - 8;
        arrowStyle = {
          bottom: -8,
          left: Math.max(16, Math.min(BUBBLE_WIDTH - 16, arrowLeftPos2)),
          transform: [{ rotate: '45deg' }],
        };
        break;
    }
    
    // Log the selected position for debugging
    console.log(`Step: ${currentStepName}, Position: ${preferredPosition}, X: ${x}`);
    
    return { bubbleStyle, arrowStyle };
  };
  
  const { bubbleStyle, arrowStyle } = getBubblePosition();
  
  useEffect(() => {
    // Entrance animation
    bubbleScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [text]);
  
  // Animated style for bubble
  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }]
  }));
  
  return (
    <Animated.View 
      style={[
        tw`absolute bg-white rounded-2xl p-4 shadow-lg`,
        { 
          width: BUBBLE_WIDTH, 
          maxHeight: SCREEN_HEIGHT * 0.3,
          shadowColor: '#2563eb', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowRadius: 10, 
          shadowOpacity: 0.3,
          elevation: 8,
          zIndex: 1100,
          borderWidth: 1,
          borderColor: 'rgba(37, 99, 235, 0.2)'
        },
        bubbleStyle,
        animatedBubbleStyle
      ]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Text style={tw`text-darkBg text-sm font-medium leading-5`}>{text}</Text>
      
      {totalSteps > 1 && (
        <View style={tw`flex-row justify-between items-center mt-3 pt-2 border-t border-gray-200`}>
          <Text style={tw`text-gray-500 text-xs`}>
            {step} of {totalSteps}
          </Text>
          <View style={tw`flex-row`}>
            {step > 1 && (
              <TouchableOpacity 
                onPress={onPrevStep}
                style={tw`bg-gray-300 px-4 py-1.5 rounded-full mr-2`}
                activeOpacity={0.7}
              >
                <Text style={tw`text-gray-700 text-xs font-bold`}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={onNextStep}
              style={tw`bg-blue-500 px-4 py-1.5 rounded-full`}
              activeOpacity={0.7}
            >
              <Text style={tw`text-white text-xs font-bold`}>
                {step < totalSteps ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View 
        style={[
          tw`absolute bg-white h-4 w-4 shadow-lg`,
          { 
            shadowColor: '#2563eb', 
            shadowOffset: { width: 0, height: 0 }, 
            shadowOpacity: 0.15,
            borderWidth: 1,
            borderColor: 'rgba(37, 99, 235, 0.2)',
            zIndex: -1
          },
          arrowStyle
        ]} 
      />
    </Animated.View>
  );
};

// Glow effect component
const GlowEffect = () => {
  const glowOpacity = useSharedValue(0.6);
  const glowScale = useSharedValue(1);
  
  useEffect(() => {
    // Pulsating glow effect
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500 }),
        withTiming(0.6, { duration: 1500 }),
      ),
      -1,
      true
    );
    
    // Subtle scale animation for the glow
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
      true
    );
  }, []);
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }]
  }));
  
  return (
    <Animated.View 
      style={[
        tw`absolute -inset-1 bg-blue-500 rounded-full`,
        { opacity: 0.6 },
        glowStyle
      ]}
    />
  );
};

const Mascot = () => {
  // Use Zustand store
  const { 
    currentDialog, 
    isVisible, 
    animationState,
    toggleVisibility, 
    setPosition,
    setDialog,
    setAnimationState,
    scrollViewRef
  } = useMascotStore(state => state);

  // Get the initial position from the store
  const initialPosition = useMascotStore(state => state.position);

  // Guide state management
  const [currentStep, setCurrentStep] = useState(1);
  const [guideSteps, setGuideSteps] = useState([]);
  const [currentStepName, setCurrentStepName] = useState('welcome');
  
  // Animation values
  const posX = useSharedValue(initialPosition.x);
  const posY = useSharedValue(initialPosition.y);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  // Set up animated effects
  useEffect(() => {
    if (animationState === 'idle' || animationState === 'bobbing') {
      // Bobbing animation
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1000 }),
          withTiming(0, { duration: 1000 }),
        ),
        -1,
        true
      );
      
      // Subtle pulsing
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500 }),
          withTiming(1, { duration: 1500 }),
        ),
        -1,
        true
      );
      
      // Subtle rotation
      rotation.value = withRepeat(
        withSequence(
          withTiming(-0.05, { duration: 2000 }),
          withTiming(0.05, { duration: 2000 }),
        ),
        -1,
        true
      );
    } else if (animationState === 'excited') {
      // More energetic animations
      translateY.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        3,
        true
      );
      
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 300 }),
      );
      
      rotation.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(-0.1, { duration: 100 }),
        withTiming(0.1, { duration: 100 }),
        withTiming(-0.1, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );
    } else if (animationState === 'talking') {
      // Talking animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 }),
        ),
        2,
        true
      );
    }
  }, [animationState]);
  
  // Safe function to update store position
  const updatePosition = (x, y) => {
    setPosition({ x, y });
  };

  // Gesture for dragging the mascot
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withTiming(1.1, { duration: 200 });
    })
    .onUpdate((event) => {
      // Keep the mascot within screen bounds
      const newX = Math.max(0, Math.min(event.absoluteX - 30, SCREEN_WIDTH - 60));
      const newY = Math.max(0, Math.min(event.absoluteY - 30, SCREEN_HEIGHT - 60));
      
      posX.value = newX;
      posY.value = newY;
      runOnJS(updatePosition)(newX, newY);
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200 });
      runOnJS(setAnimationState)('bobbing');
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}rad` }
      ],
      opacity: opacity.value,
      left: posX.value,
      top: posY.value,
    };
  });
  
  // Map step index to step name
  const getStepNameFromIndex = (index) => {
    const stepNames = ['welcome', 'card', 'like', 'bookmark', 'menu', 'finish'];
    return index < stepNames.length ? stepNames[index] : 'finish';
  };
  
  // Handle next step in the guide
  const handleNextStep = () => {
    // Scroll to the top of the HomeScreen first
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }

    if (currentStep < guideSteps.length) {
      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setDialog(guideSteps[nextStep - 1]);
      
      // Update step name and position based on step number
      let nextStepName;
      switch(nextStep) {
        case 1:
          nextStepName = 'card';
          break;
        case 2:
          nextStepName = 'like';
          break;
        case 3:
          nextStepName = 'bookmark';
          break;
        case 4: 
          nextStepName = 'menu';
          break;
        default:
          nextStepName = 'finish';
      }
      
      setCurrentStepName(nextStepName);
      
      // Move mascot to appropriate position for the current step
      moveToFixedPosition(nextStepName);
    } else {
      // End the guide - move to bottom right corner
      setCurrentStep(1);
      setDialog('');
      setAnimationState('bobbing');
      moveToFixedPosition('finish');
    }
  };
  
  // Handle previous step in the guide
  const handlePrevStep = () => {
    // Scroll to the top of the HomeScreen first
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    
    if (currentStep > 1) {
      // Move to previous step
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setDialog(guideSteps[prevStep - 1]);
      
      // Update step name and position based on step number
      let prevStepName;
      switch(prevStep) {
        case 1:
          prevStepName = 'card';
          break;
        case 2:
          prevStepName = 'like';
          break;
        case 3:
          prevStepName = 'bookmark';
          break;
        case 4: 
          prevStepName = 'menu';
          break;
        default:
          prevStepName = 'welcome';
      }
      
      setCurrentStepName(prevStepName);
      
      // Move mascot to appropriate position for the previous step
      moveToFixedPosition(prevStepName);
    }
  };
  
  // Move mascot to appropriate fixed position based on step name
  const moveToFixedPosition = (stepName) => {
    if (!STEP_POSITIONS[stepName]) return;
    
    const newPos = STEP_POSITIONS[stepName];
    
    // Animate movement with nice spring physics
    posX.value = withSpring(newPos.x, { 
      damping: 15, 
      stiffness: 100,
      mass: 1
    });
    posY.value = withSpring(newPos.y, { 
      damping: 15, 
      stiffness: 100,
      mass: 1
    });
    
    // Update store position
    updatePosition(newPos.x, newPos.y);
  };
  
  // Start guide for card component
  const startCardGuide = () => {
    const steps = [
      "This is a content card! Tap on it to view more details about this place.",
      "Tap the heart icon to like this place. It will be saved to your likes.",
      "Tap the bookmark icon to save this place to your collections for later viewing.",
      "Use this menu to share, report or hide content that doesn't interest you."
    ];
    
    setGuideSteps(steps);
    setCurrentStep(1);
    setCurrentStepName('card');
    setDialog(steps[0]);
    setAnimationState('talking');
    
    // Move mascot to card position
    moveToFixedPosition('card');
  };
  
  // Handle tap on mascot
  const handlePress = () => {
    // Play a tap animation
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 100 })
    );
    
    // Show excited animation
    setAnimationState('excited');
    
    // Start the card guide
    setTimeout(() => {
      startCardGuide();
    }, 500);
  };
  
  if (!isVisible) return null;
  
  // Get current position for the thought bubble positioning
  const currentPosition = { x: posX.value, y: posY.value };
  
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          tw`absolute`,
          {
            zIndex: 1000,
          },
          animatedStyles
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <View style={tw`relative`}>
            {currentDialog && (
              <ThoughtBubble 
                text={currentDialog} 
                step={currentStep}
                totalSteps={guideSteps.length}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                currentStepName={currentStepName}
                mascotPosition={currentPosition}
              />
            )}
            
            {/* Glow effect */}
            <GlowEffect />
            
            <Image 
              source={require('../assets/mascot.png')} 
              style={tw`h-16 w-16`} 
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default Mascot; 