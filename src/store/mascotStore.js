import { create } from 'zustand';

const useMascotStore = create((set) => ({
  currentDialog: '',
  targetElement: null,
  isVisible: true,
  position: { x: 20, y: 100 },
  animationState: 'idle', // idle, bobbing, talking, moving
  scrollViewRef: null, // Reference to the HomeScreen ScrollView

  setDialog: (dialog) => set({ currentDialog: dialog }),
  setTargetElement: (element) => set({ targetElement: element }),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setPosition: (position) => set((state) => {
    // Create a new position object to avoid mutation issues
    return { position: { ...position } };
  }),
  setAnimationState: (animationState) => set({ animationState }),
  setScrollViewRef: (ref) => set({ scrollViewRef: ref }), // Set the ScrollView reference
  
  // Helper functions for guiding the user
  showGuideForElement: (elementId, dialog) => set({
    currentDialog: dialog,
    targetElement: elementId,
    animationState: 'talking',
  }),

  resetGuide: () => set({
    currentDialog: '',
    targetElement: null,
    animationState: 'idle',
  }),
}));

export default useMascotStore; 