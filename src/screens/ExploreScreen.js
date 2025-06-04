import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  TextInput,
  Image,
  Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../theme/tailwind';
import Card from '../components/Card';
import useMascotStore from '../store/mascotStore';

// Enhanced Category Item with animation
const CategoryItem = ({ title, icon, isActive, onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (isActive) {
      Animated.spring(scale, {
        toValue: 1.05,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      }).start();
    }
  }, [isActive]);
  
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity 
        style={[
          tw`px-5 py-2.5 rounded-2xl mr-3 flex-row items-center`,
          isActive 
            ? tw`bg-primary` 
            : tw`bg-[#1e1e1e] border border-gray-800`
        ]}
        onPress={onPress}
      >
        <Icon 
          name={icon} 
          size={16} 
          color={isActive ? tw.color('textPrimary') : tw.color('primary')} 
          style={tw`mr-2`}
        />
        <Text 
          style={[
            tw`font-medium text-sm`,
            isActive ? tw`text-textPrimary` : tw`text-textSecondary`
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Search bar component with clear button
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearch = (text) => {
    setQuery(text);
    onSearch(text);
  };
  
  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <View style={tw`mb-2 relative`}>
      <View style={tw`absolute left-3.5 top-3 z-10`}>
        <Icon 
          name="magnify" 
          size={20} 
          color={tw.color('textSecondary')} 
        />
      </View>
      <TextInput
        style={[
          tw`bg-[#1e1e1e] rounded-2xl pl-10 pr-4 py-2.5 text-textPrimary`,
          { height: 44 }
        ]}
        placeholder="Search spiritual topics..."
        placeholderTextColor={tw.color('textSecondary')}
        value={query}
        onChangeText={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={tw.color('primary')}
      />
      {query.length > 0 && (
        <TouchableOpacity 
          style={tw`absolute right-3 top-3 z-10`}
          onPress={clearSearch}
        >
          <Icon name="close-circle" size={20} color={tw.color('textSecondary')} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Section Title component
const SectionTitle = ({ title, count }) => (
  <View style={tw`flex-row items-center justify-between mb-2`}>
    <Text style={tw`text-textPrimary font-semibold text-lg`}>{title}</Text>
    {count !== undefined && (
      <View style={tw`bg-primary/10 px-2 py-1 rounded-lg`}>
        <Text style={tw`text-primary text-xs font-medium`}>
          {count} {count === 1 ? 'item' : 'items'}
        </Text>
      </View>
    )}
  </View>
);

// Sample spiritual practice categories
const categories = [
  { id: 'all', title: 'All', icon: 'star-outline' },
  { id: 'meditation', title: 'Meditation', icon: 'meditation' },
  { id: 'yoga', title: 'Yoga', icon: 'yoga' },
  { id: 'mindfulness', title: 'Mindfulness', icon: 'brain' },
  { id: 'chakras', title: 'Chakras', icon: 'mandala' },
  { id: 'healing', title: 'Healing', icon: 'heart-pulse' },
];

// Sample explore items
const exploreData = [
  {
    id: 'explore1',
    title: 'Chakra Balancing Guide',
    description: 'Learn how to align and balance your seven chakras for optimal energy flow and spiritual well-being.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop' },
    category: 'chakras',
  },
  {
    id: 'explore2',
    title: 'Zen Meditation Techniques',
    description: 'Explore ancient Zen meditation techniques to calm your mind and connect with your inner wisdom.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&auto=format&fit=crop' },
    category: 'meditation',
  },
  {
    id: 'explore3',
    title: 'Hatha Yoga for Beginners',
    description: 'A gentle introduction to Hatha yoga poses that balance body and mind for spiritual growth.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format&fit=crop' },
    category: 'yoga',
  },
  {
    id: 'explore4',
    title: 'Mindful Walking Practice',
    description: 'Transform your daily walks into a mindfulness practice with these simple techniques for staying present.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop' },
    category: 'mindfulness',
  },
  {
    id: 'explore5',
    title: 'Sound Healing Journey',
    description: 'Discover how sound frequencies can heal your body, mind, and spirit through ancient vibrational practices.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1519694347429-e75aa9c66c8c?w=500&auto=format&fit=crop' },
    category: 'healing',
  },
  {
    id: 'explore6',
    title: 'Third Eye Meditation',
    description: 'Open your third eye chakra and enhance your intuition with this guided meditation practice.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1546290581-0717320c4b5d?w=500&auto=format&fit=crop' },
    category: 'chakras',
  },
];

const ExploreScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState(exploreData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = React.useRef(null);
  const { showGuideForElement } = useMascotStore();
  const insets = useSafeAreaInsets();
  
  // Filter items based on active category and search query
  useEffect(() => {
    let result = exploreData;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(result);
  }, [activeCategory, searchQuery]);
  
  // Handle category selection
  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  
  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
  };
  
  // Handle card selection
  const handleCardPress = (cardId) => {
    switch(cardId) {
      case 'explore1':
        showGuideForElement('explore1', 'Learn about the seven chakras and how to balance them for spiritual growth.');
        break;
      case 'explore2':
        showGuideForElement('explore2', 'Zen meditation focuses on emptying the mind and being fully present.');
        break;
      case 'explore3':
        showGuideForElement('explore3', 'Hatha yoga combines physical postures with breathing techniques.');
        break;
      case 'explore4':
        showGuideForElement('explore4', 'Walking meditation helps you stay present while moving through the world.');
        break;
      case 'explore5':
        showGuideForElement('explore5', 'Sound healing uses vibrations to restore harmony to body and mind.');
        break;
      case 'explore6':
        showGuideForElement('explore6', 'The third eye chakra is associated with intuition and spiritual awareness.');
        break;
      default:
        break;
    }
  };
  
  // Handle scroll events
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 200 && !showScrollTop) {
      setShowScrollTop(true);
    } else if (scrollY <= 200 && showScrollTop) {
      setShowScrollTop(false);
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  
  return (
    <View style={[tw`flex-1 bg-darkBg`, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <View style={tw`p-4`}>
        <Text style={tw`text-textPrimary text-xl font-bold mb-2`}>Discover spiritual practices</Text>
        <SearchBar onSearch={handleSearch} />
        
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={tw`py-3`}
        >
          {categories.map((category) => (
            <CategoryItem 
              key={category.id}
              title={category.title} 
              icon={category.icon} 
              isActive={activeCategory === category.id} 
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* Results */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={tw`px-4 pb-8`}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <SectionTitle 
          title="Results" 
          count={filteredItems.length} 
        />
        
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              imageSource={item.imageSource}
              onPress={() => handleCardPress(item.id)}
              cardData={item}
            />
          ))
        ) : (
          <View style={tw`my-4 p-4 bg-darkCard rounded-xl items-center`}>
            <Icon name="magnify-close" size={48} color={tw.color('textSecondary')} style={tw`mb-2`} />
            <Text style={tw`text-textPrimary text-lg font-medium mb-1`}>No results found</Text>
            <Text style={tw`text-textSecondary text-center`}>
              Try adjusting your search or filter to find what you're looking for
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <TouchableOpacity
          style={tw`absolute bottom-6 right-6 bg-primary rounded-full p-3 shadow-lg`}
          onPress={scrollToTop}
        >
          <Icon name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ExploreScreen; 