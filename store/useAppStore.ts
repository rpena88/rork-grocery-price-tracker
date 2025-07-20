import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilterOptions, PriceSubmission, PriceVerification } from '@/types';
import { priceSubmissions as mockSubmissions } from '@/mocks/data';

interface AppState {
  submissions: PriceSubmission[];
  filterOptions: FilterOptions;
  searchQuery: string;
  userSubmissions: PriceSubmission[];
  
  // Actions
  addSubmission: (submission: PriceSubmission) => void;
  updateSubmission: (id: string, updates: Partial<PriceSubmission>) => void;
  deleteSubmission: (id: string) => void;
  voteSubmission: (id: string, voteType: 'up' | 'down' | null) => void;
  verifySubmission: (id: string, verification: PriceVerification) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  setSearchQuery: (query: string) => void;
}

// Create the store with proper memoization to avoid infinite loops
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      submissions: mockSubmissions,
      filterOptions: {
        sortBy: 'newest',
      },
      searchQuery: '',
      userSubmissions: [],
      
      addSubmission: (submission) => 
        set((state) => ({ 
          submissions: [submission, ...state.submissions],
          userSubmissions: [submission, ...state.userSubmissions],
        })),
      
      updateSubmission: (id, updates) =>
        set((state) => ({
          submissions: state.submissions.map((sub) => 
            sub.id === id ? { ...sub, ...updates } : sub
          ),
          userSubmissions: state.userSubmissions.map((sub) => 
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        })),
      
      deleteSubmission: (id) =>
        set((state) => ({
          submissions: state.submissions.filter((sub) => sub.id !== id),
          userSubmissions: state.userSubmissions.filter((sub) => sub.id !== id),
        })),
      
      voteSubmission: (id, voteType) =>
        set((state) => {
          const submission = state.submissions.find((sub) => sub.id === id);
          if (!submission) return state;
          
          const prevVote = submission.userVoted;
          let upvotes = submission.upvotes;
          let downvotes = submission.downvotes;
          
          // Remove previous vote if exists
          if (prevVote === 'up') upvotes--;
          if (prevVote === 'down') downvotes--;
          
          // Add new vote if not null
          if (voteType === 'up') upvotes++;
          if (voteType === 'down') downvotes++;
          
          const updatedSubmission = {
            ...submission,
            upvotes,
            downvotes,
            userVoted: voteType,
          };
          
          return {
            submissions: state.submissions.map((sub) => 
              sub.id === id ? updatedSubmission : sub
            ),
            userSubmissions: state.userSubmissions.map((sub) => 
              sub.id === id ? updatedSubmission : sub
            ),
          };
        }),
      
      verifySubmission: (id, verification) =>
        set((state) => {
          const submission = state.submissions.find((sub) => sub.id === id);
          if (!submission) return state;
          
          // Check if user already verified this submission
          const alreadyVerified = submission.verifications.some(
            (v) => v.userId === verification.userId
          );
          
          if (alreadyVerified) return state;
          
          const updatedSubmission = {
            ...submission,
            verifications: [...submission.verifications, verification],
            userVerified: verification.userId === '1', // Mock current user check
          };
          
          return {
            submissions: state.submissions.map((sub) => 
              sub.id === id ? updatedSubmission : sub
            ),
            userSubmissions: state.userSubmissions.map((sub) => 
              sub.id === id ? updatedSubmission : sub
            ),
          };
        }),
      
      setFilterOptions: (options) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...options },
        })),
      
      setSearchQuery: (query) =>
        set({ searchQuery: query }),
    }),
    {
      name: 'grocery-price-tracker',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userSubmissions: state.userSubmissions,
      }),
    }
  )
);