import React from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../theme/tailwind';

const ProgressCard = ({ title, value, icon }) => (
  <View style={tw`bg-darkCard p-4 rounded-xl border border-gray-800 mb-3`}>
    <View style={tw`flex-row items-center`}>
      <View style={tw`w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3`}>
        <Icon name={icon} size={20} color={tw.color('primary')} />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-textSecondary text-sm mb-1`}>{title}</Text>
        <Text style={tw`text-textPrimary text-lg font-bold`}>{value}</Text>
      </View>
    </View>
  </View>
);

const SettingItem = ({ title, icon, onPress }) => (
  <TouchableOpacity 
    style={tw`flex-row items-center py-4 px-4 border-b border-gray-800`}
    onPress={onPress}
  >
    <Icon name={icon} size={22} color={tw.color('textSecondary')} style={tw`mr-3`} />
    <Text style={tw`text-textPrimary flex-1`}>{title}</Text>
    <Icon name="chevron-right" size={22} color={tw.color('textSecondary')} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[tw`flex-1 bg-darkBg`, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header with avatar */}
        <View style={tw`items-center justify-center pt-6 pb-4`}>
          <View style={tw`relative`}>
            <View style={tw`rounded-full h-24 w-24 bg-primary/20 items-center justify-center overflow-hidden border-2 border-primary`}>
              <Image 
                source={require('../assets/mascot.png')} 
                style={tw`h-24 w-24`}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity 
              style={tw`absolute bottom-0 right-0 bg-primary rounded-full p-2`}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Icon name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={tw`text-textPrimary text-2xl font-bold mt-3`}>Spiritual Seeker</Text>
          <Text style={tw`text-textSecondary text-sm mt-1`}>"On a journey of inner peace"</Text>
          
          <View style={tw`bg-primary/10 rounded-full px-4 py-2 mt-3 flex-row items-center`}>
            <Icon name="star" size={16} color={tw.color('primary')} style={tw`mr-2`} />
            <Text style={tw`text-primary font-medium`}>Soul Level: Awakening</Text>
          </View>
        </View>
        
        {/* Journey progress section */}
        <View style={tw`px-4 pt-4 pb-6`}>
          <Text style={tw`text-textPrimary text-xl font-bold mb-3`}>Journey Progress</Text>
          
          {/* Meditation streak stat */}
          <View style={tw`bg-darkCard rounded-xl p-4 mb-3 flex-row items-center`}>
            <View style={tw`bg-primary/20 rounded-full p-3 mr-4`}>
              <Icon name="meditation" size={24} color={tw.color('primary')} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-textSecondary mb-1`}>Meditation Streak</Text>
              <Text style={tw`text-textPrimary text-2xl font-bold`}>7 days</Text>
            </View>
          </View>
          
          {/* Courses completed stat */}
          <View style={tw`bg-darkCard rounded-xl p-4 mb-3 flex-row items-center`}>
            <View style={tw`bg-primary/20 rounded-full p-3 mr-4`}>
              <Icon name="school" size={24} color={tw.color('primary')} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-textSecondary mb-1`}>Courses Completed</Text>
              <Text style={tw`text-textPrimary text-2xl font-bold`}>3</Text>
            </View>
          </View>
          
          {/* Daily affirmations stat */}
          <View style={tw`bg-darkCard rounded-xl p-4 mb-3 flex-row items-center`}>
            <View style={tw`bg-primary/20 rounded-full p-3 mr-4`}>
              <Icon name="text-box-check" size={24} color={tw.color('primary')} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-textSecondary mb-1`}>Daily Affirmations</Text>
              <Text style={tw`text-textPrimary text-2xl font-bold`}>15</Text>
            </View>
          </View>
        </View>
        
        {/* Settings section */}
        <View style={tw`px-4 pt-2 pb-8`}>
          <Text style={tw`text-textPrimary text-xl font-bold mb-3`}>Settings & Preferences</Text>
          
          <TouchableOpacity style={tw`bg-darkCard rounded-xl p-4 mb-3 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`bg-primary/10 rounded-full p-2 mr-3`}>
                <Icon name="bell-outline" size={20} color={tw.color('textPrimary')} />
              </View>
              <Text style={tw`text-textPrimary text-base`}>Notification Settings</Text>
            </View>
            <Icon name="chevron-right" size={20} color={tw.color('textSecondary')} />
          </TouchableOpacity>
          
          <TouchableOpacity style={tw`bg-darkCard rounded-xl p-4 mb-3 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`bg-primary/10 rounded-full p-2 mr-3`}>
                <Icon name="palette-outline" size={20} color={tw.color('textPrimary')} />
              </View>
              <Text style={tw`text-textPrimary text-base`}>Theme Preferences</Text>
            </View>
            <Icon name="chevron-right" size={20} color={tw.color('textSecondary')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
