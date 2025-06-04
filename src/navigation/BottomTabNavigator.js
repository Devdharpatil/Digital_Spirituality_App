import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue, 
  interpolateColor,
  withSpring,
  Easing,
  withSequence
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../theme/tailwind';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import ExploreScreen from '../screens/ExploreScreen';

// Custom tab bar icon component with animations
const AnimatedTabIcon = ({ focused, routeName, iconName }) => {
  // Create animated values for scaling and rotation
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.8);
  const glow = useSharedValue(0);
  
  // Set up animations when tab becomes focused
  React.useEffect(() => {
    if (focused) {
      // More magical animation effect with sequential animations
      scale.value = withSpring(1.15, { damping: 8, stiffness: 100 });
      translateY.value = withSpring(-2, { damping: 6, stiffness: 80 });
      opacity.value = withTiming(1, { duration: 200 });
      glow.value = withTiming(1, { duration: 400, easing: Easing.bezier(0.33, 0.1, 0.67, 1) });
    } else {
      scale.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 10 });
      opacity.value = withTiming(0.8, { duration: 200 });
      glow.value = withTiming(0, { duration: 300 });
    }
  }, [focused, scale, translateY, opacity, glow]);

  // Create animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value,
      shadowColor: '#2563eb',
      shadowOpacity: glow.value * 0.8,
      shadowRadius: glow.value * 8,
      elevation: glow.value * 4,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: focused ? withSpring(-3, { damping: 3 }) : withSpring(0) }
      ]
    };
  });

  // Get the correct color based on focus state
  const iconColor = focused ? '#2563eb' : '#9ca3af';
  const textColor = focused ? tw`text-primary font-bold` : tw`text-textSecondary`;
  
  return (
    <View style={tw`items-center justify-center py-1`}>
      <Animated.View style={animatedStyle}>
        <Icon name={iconName} size={24} color={iconColor} />
      </Animated.View>
      <Animated.Text 
        style={[textColor, tw`text-xs mt-1`, textAnimatedStyle]} 
        numberOfLines={1} 
        ellipsizeMode="tail"
      >
        {routeName}
      </Animated.Text>
    </View>
  );
};

// Custom tab bar component with sliding indicator
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { width } = Dimensions.get('window');
  const tabWidth = width / state.routes.length;
  
  // Animated value for the indicator position
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(tabWidth);
  const indicatorHeight = useSharedValue(3);
  
  // Update indicator position when active tab changes
  React.useEffect(() => {
    // Enhanced fluid animation for the indicator
    
    // Start by slightly shrinking the indicator
    indicatorWidth.value = withTiming(tabWidth * 0.7, { 
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    // Move it smoothly
    indicatorPosition.value = withSpring(state.index * tabWidth, {
      damping: 14,
      stiffness: 80,
      mass: 0.5,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01
    });
    
    // Then gradually expand it
    setTimeout(() => {
      indicatorWidth.value = withTiming(tabWidth, { 
        duration: 250,
        easing: Easing.bezier(0.22, 1, 0.36, 1)
      });
      
      // Add a subtle bounce to the height
      indicatorHeight.value = withSequence(
        withTiming(5, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(3, { duration: 150, easing: Easing.inOut(Easing.quad) })
      );
    }, 100);
  }, [state.index, tabWidth, indicatorPosition, indicatorWidth, indicatorHeight]);
  
  // Create animated style for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
      height: indicatorHeight.value
    };
  });
  
  return (
    <View style={tw`flex-row bg-darkCard border-t border-gray-800`}>
      {/* Animated indicator */}
      <Animated.View 
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#2563eb',
            borderRadius: 2,
            zIndex: 1
          },
          indicatorStyle
        ]} 
      />
      
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;
        
        // Map route names to icon names
        const getIconName = () => {
          switch (route.name) {
            case 'Home': return 'home';
            case 'Explore': return 'compass';
            case 'Chat': return 'chat';
            case 'Saved': return 'bookmark';
            case 'Profile': return 'account';
            default: return 'circle';
          }
        };
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            activeOpacity={0.7}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingVertical: 8,
                backgroundColor: isFocused ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                borderRadius: 16,
              }}
            >
              <AnimatedTabIcon 
                focused={isFocused} 
                routeName={label} 
                iconName={getIconName()}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
