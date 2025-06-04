import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../theme/tailwind';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideInLeft,
  interpolateColor
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define message types
const MESSAGE_TYPES = {
  USER: 'user',
  GUIDE: 'guide',
  SYSTEM: 'system'
};

// Initial messages for the chat
const initialMessages = [
  {
    id: '1',
    text: 'Welcome to your spiritual guide chat! I\'m here to assist you on your journey to inner peace and enlightenment.',
    type: MESSAGE_TYPES.GUIDE,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '2',
    text: 'You can ask me questions about meditation techniques, spiritual practices, or seek guidance for your personal journey.',
    type: MESSAGE_TYPES.GUIDE,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '3',
    text: 'How are you feeling today?',
    type: MESSAGE_TYPES.GUIDE,
    timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  }
];

// Suggestions for quick responses
const suggestions = [
  "I'm feeling anxious today",
  "Recommend a meditation",
  "How can I be more mindful?"
];

// Format timestamp for messages
const formatMessageTime = (timestamp) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  
  // If message is from today, show time only
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise show date and time
  return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
    ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Group messages by date for showing date separators
const groupMessagesByDate = (messages) => {
  const groupedMessages = [];
  let lastDate = null;
  
  messages.forEach(message => {
    const messageDate = new Date(message.timestamp);
    const dateString = messageDate.toDateString();
    
    if (dateString !== lastDate) {
      groupedMessages.push({
        id: `date-${dateString}`,
        type: 'date',
        date: messageDate
      });
      lastDate = dateString;
    }
    
    groupedMessages.push(message);
  });
  
  return groupedMessages;
};

// Decorative spiritual symbols for the background
const SpiritualSymbol = ({ symbol, style }) => {
  const opacity = useSharedValue(0.05);
  const scale = useSharedValue(1);

  useEffect(() => {
    const randomDuration = 3000 + Math.random() * 5000;
    
    // Subtle breathing animation
    const interval = setInterval(() => {
      opacity.value = withSequence(
        withTiming(0.15, { duration: randomDuration / 2 }),
        withTiming(0.05, { duration: randomDuration / 2 })
      );
      
      scale.value = withSequence(
        withTiming(1.1, { duration: randomDuration / 2 }),
        withTiming(1, { duration: randomDuration / 2 })
      );
    }, randomDuration);
    
    return () => clearInterval(interval);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Icon name={symbol} size={24} color="#2563eb" />
    </Animated.View>
  );
};

// Background decorative component
const ChatBackground = () => {
  const symbols = [
    { symbol: 'meditation', position: { top: '10%', left: '5%' } },
    { symbol: 'yoga', position: { top: '30%', right: '7%' } },
    { symbol: 'peace', position: { bottom: '25%', left: '8%' } },
    { symbol: 'water', position: { bottom: '10%', right: '12%' } },
    { symbol: 'heart-outline', position: { top: '50%', left: '15%' } },
    { symbol: 'star-outline', position: { top: '70%', right: '15%' } },
  ];
  
  return (
    <View style={tw`absolute inset-0 z-0`}>
      {symbols.map((item, index) => (
        <SpiritualSymbol 
          key={index} 
          symbol={item.symbol} 
          style={{ position: 'absolute', ...item.position }}
        />
      ))}
    </View>
  );
};

// Message bubble component
const MessageBubble = ({ message, isLastMessage }) => {
  const isUser = message.type === MESSAGE_TYPES.USER;
  const isSystem = message.type === MESSAGE_TYPES.SYSTEM;
  
  // Animation for message appearance
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  
  React.useEffect(() => {
    // Animate message appearance
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { 
      damping: 12,
      stiffness: 100
    });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    };
  });
  
  // System message styling
  if (isSystem) {
    return (
      <Animated.View 
        style={[
          tw`py-2 px-4 mx-auto my-1 rounded-full bg-darkCard/50 border border-gray-800`,
          animatedStyle,
          { shadowColor: '#2563eb', shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 }
        ]}
      >
        <Text style={tw`text-textSecondary text-xs text-center`}>{message.text}</Text>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View
      style={[
        tw`max-w-[80%] mb-3`,
        isUser ? tw`self-end` : tw`self-start`,
        animatedStyle
      ]}
    >
      {!isUser && (
        <View style={tw`flex-row items-center mb-1`}>
          <Image 
            source={require('../assets/mascot.png')}
            style={tw`w-6 h-6 rounded-full mr-2`}
            resizeMode="cover"
          />
          <Text style={tw`text-textSecondary text-xs`}>Spiritual Guide</Text>
        </View>
      )}
      
      <View
        style={[
          tw`rounded-xl p-3`,
          isUser 
            ? tw`bg-primary/90 rounded-tr-none` 
            : tw`bg-darkCard border border-gray-800 rounded-tl-none`,
          { 
            shadowColor: isUser ? '#2563eb' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isUser ? 0.3 : 0.1,
            shadowRadius: isUser ? 8 : 4,
            elevation: 3
          }
        ]}
      >
        <Text 
          style={[
            isUser ? tw`text-white` : tw`text-textPrimary`,
            { lineHeight: 20 }
          ]}
        >
          {message.text}
        </Text>
      </View>
      
      <View style={tw`flex-row items-center ${isUser ? 'justify-end' : 'justify-start'} mt-1`}>
        <Text style={tw`text-xs text-textSecondary`}>
          {formatMessageTime(message.timestamp)}
        </Text>
        
        {isUser && isLastMessage && (
          <View style={tw`flex-row items-center ml-2`}>
            <Icon name="check-all" size={14} color="#2563eb" />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Date separator component
const DateSeparator = ({ date }) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  let dateText;
  if (date.toDateString() === now.toDateString()) {
    dateText = 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateText = 'Yesterday';
  } else {
    dateText = date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  return (
    <View style={tw`flex-row items-center justify-center my-4`}>
      <View style={tw`flex-1 h-[1px] bg-gray-800`} />
      <View style={tw`mx-3 px-4 py-1 rounded-full bg-primary/10`}>
        <Text style={tw`text-xs text-primary font-medium`}>{dateText}</Text>
      </View>
      <View style={tw`flex-1 h-[1px] bg-gray-800`} />
    </View>
  );
};

// Suggestion chip component with animations
const SuggestionChip = ({ text, onPress, index }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(
      index * 100, 
      withTiming(1, { duration: 300 })
    );
    
    scale.value = withDelay(
      index * 100, 
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={tw`bg-darkCard border border-gray-800 rounded-full px-4 py-2 mr-2 mb-2`}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={tw`text-textSecondary`}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Typing indicator with improved animation
const TypingIndicator = ({ isTyping }) => {
  if (!isTyping) return null;
  
  const dotScale1 = useSharedValue(1);
  const dotScale2 = useSharedValue(1);
  const dotScale3 = useSharedValue(1);
  
  useEffect(() => {
    const animateDots = () => {
      dotScale1.value = withSequence(
        withTiming(1.5, { duration: 300, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) })
      );
      
      setTimeout(() => {
        dotScale2.value = withSequence(
          withTiming(1.5, { duration: 300, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) })
        );
      }, 150);
      
      setTimeout(() => {
        dotScale3.value = withSequence(
          withTiming(1.5, { duration: 300, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) })
        );
      }, 300);
    };
    
    animateDots();
    const interval = setInterval(animateDots, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale1.value }]
  }));
  
  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale2.value }]
  }));
  
  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale3.value }]
  }));
  
  return (
    <Animated.View 
      style={tw`flex-row items-end self-start mb-3 ml-2`}
    >
      <View style={tw`flex-row items-center mb-1`}>
        <Image 
          source={require('../assets/mascot.png')}
          style={tw`w-6 h-6 rounded-full mr-2`}
          resizeMode="cover"
        />
        <Text style={tw`text-textSecondary text-xs`}>Spiritual Guide is typing</Text>
      </View>
      
      <View style={tw`bg-darkCard border border-gray-800 rounded-xl p-3 flex-row items-center rounded-tl-none`}>
        <Animated.View style={[tw`w-2 h-2 rounded-full bg-primary/70 mx-0.5`, dot1Style]} />
        <Animated.View style={[tw`w-2 h-2 rounded-full bg-primary/70 mx-0.5`, dot2Style]} />
        <Animated.View style={[tw`w-2 h-2 rounded-full bg-primary/70 mx-0.5`, dot3Style]} />
      </View>
    </Animated.View>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  const groupedMessages = groupMessagesByDate(messages);
  
  // Handle sending a message
  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      type: MESSAGE_TYPES.USER,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    
    // Simulate guide typing
    setIsTyping(true);
    
    // Simulate guide response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        "That's a great point. I recommend taking a few minutes each day for meditation and reflection.",
        "I understand how you feel. Remember that every spiritual journey has its ups and downs.",
        "That's interesting! The ancient wisdom traditions offer many perspectives on this topic.",
        "I'd suggest focusing on your breath and being present in the moment. This can help center your energy.",
        "Consider exploring different mindfulness practices to find what resonates with your spirit.",
        "The path to enlightenment begins with self-awareness. Try to observe your thoughts without judgment.",
        "Inner peace comes when we learn to accept what we cannot change and focus on what we can."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const guideMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        type: MESSAGE_TYPES.GUIDE,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, guideMessage]);
    }, 1500 + Math.random() * 1000);
  };
  
  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  // Add welcome system message when the chat loads
  useEffect(() => {
    setTimeout(() => {
      const welcomeMessage = {
        id: 'welcome',
        text: 'Begin your spiritual conversation',
        type: MESSAGE_TYPES.SYSTEM,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, welcomeMessage]);
    }, 1000);
  }, []);
  
  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return <DateSeparator date={item.date} />;
    }
    
    return (
      <MessageBubble 
        message={item} 
        isLastMessage={item.id === messages[messages.length - 1]?.id}
      />
    );
  };
  
  // Input focus animation
  const inputBorderColor = useSharedValue(0);
  const inputBackgroundColor = useSharedValue(0);
  
  const inputContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      inputBorderColor.value,
      [0, 1],
      ['rgba(31, 41, 55, 1)', 'rgba(37, 99, 235, 1)']
    );
    
    const backgroundColor = interpolateColor(
      inputBackgroundColor.value,
      [0, 1],
      ['rgba(17, 24, 39, 1)', 'rgba(17, 24, 39, 0.9)']
    );
    
    return {
      borderColor,
      backgroundColor
    };
  });
  
  const handleInputFocus = () => {
    inputBorderColor.value = withTiming(1, { duration: 300 });
    inputBackgroundColor.value = withTiming(1, { duration: 300 });
  };
  
  const handleInputBlur = () => {
    inputBorderColor.value = withTiming(0, { duration: 300 });
    inputBackgroundColor.value = withTiming(0, { duration: 300 });
  };
  
  // Chat header glow effect animation
  const headerGlow = useSharedValue(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      headerGlow.value = withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  const headerGlowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: 0.2 + (headerGlow.value * 0.3),
      shadowRadius: 8 + (headerGlow.value * 8),
      elevation: 4 + (headerGlow.value * 3)
    };
  });
  
  // Fix for React error by avoiding complex layout animations
  useEffect(() => {
    // Make sure Reanimated is properly initialized for this screen
    if (Platform.OS === 'android') {
      // Ensure animations are properly handled on Android
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: false });
        }
      }, 50);
    }
  }, []);
  
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };
  
  return (
    <View style={[tw`flex-1 bg-darkBg`, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      {/* Chat header */}
      <View style={tw`flex-row items-center justify-between border-b border-gray-800 p-4`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-textPrimary text-xl font-bold`}>Spiritual Guide</Text>
          <Text style={tw`text-textSecondary text-xs`}>Available for guidance 24/7</Text>
        </View>
        <TouchableOpacity 
          style={tw`rounded-full bg-primary/10 p-2`}
          onPress={() => scrollToBottom()}
        >
          <Icon name="arrow-down" size={20} color={tw.color('primary')} />
        </TouchableOpacity>
      </View>
      
      <ChatBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={tw`p-4 pb-2`}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<TypingIndicator isTyping={isTyping} />}
          // Add these props to improve list performance and reduce animation issues
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
        
        {/* Quick suggestions */}
        <View style={tw`px-4 py-2`}>
          <View style={tw`flex-row flex-wrap`}>
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                text={suggestion}
                index={index}
                onPress={() => handleSendMessage(suggestion)}
              />
            ))}
          </View>
        </View>
        
        {/* Input area */}
        <View style={tw`flex-row items-center p-3 border-t border-gray-800 bg-darkCard`}>
          <TouchableOpacity style={tw`p-2 mr-1`}>
            <Icon name="emoticon-outline" size={24} color={tw.color('textSecondary')} />
          </TouchableOpacity>
          
          <Animated.View 
            style={[
              tw`flex-1 border rounded-xl overflow-hidden`,
              inputContainerStyle
            ]}
          >
            <TextInput
              style={tw`px-4 py-2.5 text-textPrimary`}
              placeholder="Type a message..."
              placeholderTextColor={tw.color('textSecondary')}
              value={inputText}
              onChangeText={setInputText}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              multiline
              maxHeight={100}
            />
          </Animated.View>
          
          <TouchableOpacity 
            style={[
              tw`p-2.5 ml-2 rounded-full`,
              inputText.trim() 
                ? tw`bg-primary shadow-md` 
                : tw`bg-primary/50`
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
          >
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen; 