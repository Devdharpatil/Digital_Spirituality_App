import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '../theme/tailwind';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import useMascotStore from '../store/mascotStore';
import useCardStore from '../store/cardStore';

// Simple filter icon component
const FilterIcon = ({ color }) => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 14, height: 2, backgroundColor: color, marginBottom: 3 }} />
    <View style={{ width: 10, height: 2, backgroundColor: color, marginBottom: 3 }} />
    <View style={{ width: 6, height: 2, backgroundColor: color }} />
  </View>
);

const cardData = [
  {
    id: 'card1',
    title: 'Daily Spiritual Inspiration',
    description: 'Be still and know. In the silence between your thoughts lies the answers to all your questions. Today, practice finding peace in moments of stillness.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=500&auto=format&fit=crop' },
  },
  {
    id: 'card2',
    title: 'Guided Meditation',
    description: 'The breath is the bridge between mind and body. Take 5 minutes today to focus on your breath and feel the connection to your higher self.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop' },
  },
  {
    id: 'card3',
    title: 'Mental Well-being',
    description: 'Your thoughts create your reality. Practice positive affirmations today: "I am at peace with what is, what was, and what will be."',
    imageSource: { uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=500&auto=format&fit=crop' },
  },
  {
    id: 'card4',
    title: 'Mindfulness Practice',
    description: 'Bring awareness to this moment. What are you sensing? What are you feeling? Practice mindful observation of your surroundings for 3 minutes.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop' },
  },
  {
    id: 'card5',
    title: 'Spiritual Growth',
    description: 'We are not human beings having a spiritual experience. We are spiritual beings having a human experience. Reflect on how you\'ve grown spiritually this week.',
    imageSource: { uri: 'https://images.unsplash.com/photo-1493548578639-b0c241186eb0?w=500&auto=format&fit=crop' },
  },
];

const HomeScreen = () => {
  const { showGuideForElement, setDialog, setAnimationState, setScrollViewRef } = useMascotStore();
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    // Show initial guide dialog when the screen loads
    showGuideForElement('homeScreen', 'Welcome to your Spiritual Journey! Here you can find daily inspiration, meditation guides, and mindfulness practices to support your path.');
    
    // Set a timeout to automatically provide a hint about tapping the mascot
    const timerId = setTimeout(() => {
      setDialog('Tap me to learn more about the card features!');
      setAnimationState('excited');
    }, 5000);

    // Set the scrollViewRef in the mascot store
    setScrollViewRef(scrollViewRef);
    
    return () => clearTimeout(timerId);
  }, []);
  
  const handleCardPress = (cardId) => {
    // Show different dialogs based on which card was pressed
    switch(cardId) {
      case 'card1':
        showGuideForElement('card1', 'Daily inspiration to nourish your soul and elevate your spiritual awareness.');
        break;
      case 'card2':
        showGuideForElement('card2', 'Guided meditations to help you connect with your higher self and inner wisdom.');
        break;
      case 'card3':
        showGuideForElement('card3', 'Mental well-being practices to maintain harmony between mind, body, and spirit.');
        break;
      case 'card4':
        showGuideForElement('card4', 'Mindfulness exercises to keep you grounded in the present moment.');
        break;
      case 'card5':
        showGuideForElement('card5', 'Resources and reflections to support your ongoing spiritual evolution.');
        break;
      default:
        break;
    }
  };

  return (
    <View style={[tw`flex-1 bg-darkBg`, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <Mascot />
      <View style={tw`p-4 flex-row items-center justify-between`}>
        <View>
          <Text style={tw`text-textPrimary text-2xl font-bold mb-2`}>Spiritual Journey</Text>
          <Text style={tw`text-textSecondary`}>Your path to inner peace</Text>
        </View>
        <TouchableOpacity 
          style={tw`rounded-full bg-primary/10 p-2`}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <FilterIcon color={tw.color('primary')} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={tw`px-4 pb-8`}
        showsVerticalScrollIndicator={false}
        testID="homeScreen"
      >
        {cardData.map(card => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            imageSource={card.imageSource}
            onPress={() => handleCardPress(card.id)}
            cardData={card}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen; 