import { create } from 'twrnc';

// Create a tailwind instance with custom configuration
const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',  // More vibrant blue
        secondary: '#8b5cf6', // Purple
        darkBg: '#121212',
        darkCard: '#1e1e1e',
        accent: '#10b981',   // Emerald
        textPrimary: '#f3f4f6',
        textSecondary: '#9ca3af',
      },
    },
  },
});

export default tw; 