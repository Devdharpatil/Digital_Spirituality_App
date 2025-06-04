import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, Modal } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../theme/tailwind';
import useCardStore from '../store/cardStore';

// Instagram-style heart icon
const HeartIcon = ({ filled }) => {
  const filledColor = "#FF3B30";  // Vibrant red for heart
  const outlineColor = "#9CA3AF";
  
  return (
    <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
      <Icon
        name={filled ? 'heart' : 'heart-outline'}
        size={22}
        color={filled ? filledColor : outlineColor}
      />
    </View>
  );
};

// Bookmark icon using MaterialCommunityIcons (matches navigation bar)
const BookmarkIcon = ({ filled }) => {
  const filledColor = "#2563eb"; // Same blue as in the navigation bar
  const outlineColor = "#9CA3AF";
  
  return (
    <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
      <Icon
        name={filled ? 'bookmark' : 'bookmark-outline'}
        size={22}
        color={filled ? filledColor : outlineColor}
      />
    </View>
  );
};

const Card = ({ 
  title, 
  description, 
  imageSource, 
  onPress, 
  style,
  id,
  cardData
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const elevation = useSharedValue(4);
  
  // Get card store functions
  const { savedCards, saveCard, unsaveCard } = useCardStore();
  
  // Check if card is saved (bookmarked)
  const isBookmarked = savedCards.some(card => card.id === id);
  
  // Heart state (like state)
  const [isLiked, setIsLiked] = React.useState(false);
  
  // Menu state
  const [menuVisible, setMenuVisible] = React.useState(false);

  // Tap animation
  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    elevation.value = withTiming(6, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    elevation.value = withTiming(4, { duration: 150 });
  };

  // Heart animation (like)
  const heartScale = useSharedValue(1);
  
  const toggleLike = (e) => {
    e.stopPropagation();
    
    // Animate heart
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    
    // Toggle like state (visual only)
    setIsLiked(!isLiked);
  };
  
  // Bookmark animation
  const bookmarkScale = useSharedValue(1);
  
  const toggleBookmark = (e) => {
    e.stopPropagation();
    
    // Animate bookmark
    bookmarkScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    
    // Save or unsave the card
    if (isBookmarked) {
      unsaveCard(id);
    } else {
      saveCard(cardData || { id, title, description, imageSource });
    }
  };

  // Menu handlers
  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleMenuOption = (action, e) => {
    e.stopPropagation();
    setMenuVisible(false);
    
    // Handle different actions
    switch (action) {
      case 'share':
        console.log('Share card:', id);
        // Implement share functionality
        break;
      case 'report':
        console.log('Report card:', id);
        // Implement report functionality
        break;
      case 'hide':
        console.log('Hide card:', id);
        // Implement hide functionality
        break;
      default:
        break;
    }
  };

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: 0.25,
      shadowRadius: elevation.value
    };
  });
  
  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }]
    };
  });
  
  const bookmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bookmarkScale.value }]
    };
  });

  // Menu component
  const MenuDropdown = () => {
    if (!menuVisible) return null;
    
    return (
      <View style={[
        tw`absolute right-0 top-8 bg-darkCard border border-gray-700 rounded-xl shadow-xl z-50`,
        { width: 160, overflow: 'hidden' }
      ]}>
        <TouchableOpacity 
          style={tw`flex-row items-center p-3 border-b border-gray-700`}
          onPress={(e) => handleMenuOption('share', e)}
        >
          <Icon name="share-variant" size={18} color="#9CA3AF" style={tw`mr-2`} />
          <Text style={tw`text-textPrimary`}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw`flex-row items-center p-3 border-b border-gray-700`}
          onPress={(e) => handleMenuOption('report', e)}
        >
          <Icon name="flag-outline" size={18} color="#9CA3AF" style={tw`mr-2`} />
          <Text style={tw`text-textPrimary`}>Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw`flex-row items-center p-3`}
          onPress={(e) => handleMenuOption('hide', e)}
        >
          <Icon name="eye-off-outline" size={18} color="#9CA3AF" style={tw`mr-2`} />
          <Text style={tw`text-textPrimary`}>Hide</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animated.View style={[animatedStyles, tw`mb-4`]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={id}
      >
        <View style={[
          tw`bg-darkCard rounded-xl overflow-hidden shadow-lg border border-gray-800`,
          style
        ]}>
          {imageSource && (
            <View style={tw`relative`}>
              <Image 
                source={imageSource} 
                style={tw`w-full h-44 rounded-t-xl`}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={tw`absolute top-2 right-2 bg-black bg-opacity-40 rounded-full p-1.5`}
                onPress={toggleMenu}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Icon name="dots-vertical" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <MenuDropdown />
            </View>
          )}
          <View style={tw`p-4`}>
            <View style={tw`flex-row justify-between items-start`}>
              <Text style={tw`text-textPrimary text-lg font-semibold mb-2 flex-1`}>{title}</Text>
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity 
                  onPress={toggleLike}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  style={tw`mr-4`}
                >
                  <Animated.View style={heartAnimatedStyle}>
                    <HeartIcon filled={isLiked} />
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={toggleBookmark}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Animated.View style={bookmarkAnimatedStyle}>
                    <BookmarkIcon filled={isBookmarked} />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={tw`text-textSecondary mb-2`}>{description}</Text>
          </View>
        </View>
      </Pressable>

      {/* Backdrop for closing menu when tapped outside */}
      {menuVisible && (
        <TouchableOpacity
          style={tw`absolute top-0 bottom-0 left-0 right-0 z-40`}
          activeOpacity={0}
          onPress={(e) => {
            e.stopPropagation();
            setMenuVisible(false);
          }}
        />
      )}
    </Animated.View>
  );
};

export default Card; 