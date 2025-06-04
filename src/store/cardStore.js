import { create } from 'zustand';

const useCardStore = create((set, get) => ({
  savedCards: [],
  
  // Add a card to saved/favorites
  saveCard: (card) => set((state) => ({
    savedCards: state.savedCards.find(c => c.id === card.id)
      ? state.savedCards
      : [...state.savedCards, card]
  })),
  
  // Remove a card from saved/favorites
  unsaveCard: (cardId) => set((state) => ({
    savedCards: state.savedCards.filter(card => card.id !== cardId)
  })),
  
  // Check if a card is saved
  isCardSaved: (cardId) => {
    return get().savedCards.some(card => card.id === cardId);
  },
  
  // Clear all saved cards
  clearSavedCards: () => set({ savedCards: [] }),
}));

export default useCardStore; 