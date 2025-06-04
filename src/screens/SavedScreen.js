import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '../theme/tailwind';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../components/Card';
import useCardStore from '../store/cardStore';

const SavedScreen = () => {
  const { savedCards } = useCardStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1 bg-darkBg`, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <View style={tw`p-4`}>
        <Text style={tw`text-textPrimary text-xl font-bold mb-2`}>Your bookmarked content</Text>
      </View>
      
      <ScrollView contentContainerStyle={tw`flex-grow px-4 items-center justify-center`}>
        <View style={tw`items-center justify-center py-8`}>
          <Text style={tw`text-textPrimary text-xl font-semibold mb-3`}>No saved items</Text>
          <Text style={tw`text-textSecondary text-center mb-5 px-8`}>
            Bookmark items on the home screen to save them here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SavedScreen; 