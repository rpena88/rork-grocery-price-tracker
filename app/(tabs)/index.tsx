import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Stack } from 'expo-router';
import { Filter } from 'lucide-react-native';
import PriceCard from '@/components/PriceCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import DonateButton from '@/components/DonateButton';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { PriceSubmission } from '@/types';

export default function FeedScreen() {
  const { colors } = useTheme();
  
  // Fix: Use separate selectors to avoid infinite loop
  const submissions = useAppStore(state => state.submissions);
  const filterOptions = useAppStore(state => state.filterOptions);
  const searchQuery = useAppStore(state => state.searchQuery);
  
  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];
    
    // Apply category filter
    if (filterOptions.category && filterOptions.category !== 'All') {
      result = result.filter(submission => {
        const product = submission.productName.toLowerCase();
        const category = filterOptions.category?.toLowerCase() || '';
        return product.includes(category);
      });
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(submission => 
        submission.productName.toLowerCase().includes(query) ||
        submission.storeName.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (filterOptions.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'priceHighToLow':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'priceLowToHigh':
        result.sort((a, b) => a.price - b.price);
        break;
    }
    
    return result;
  }, [submissions, filterOptions, searchQuery]);
  
  const renderItem = ({ item }: { item: PriceSubmission }) => (
    <PriceCard submission={item} />
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'Price Feed',
          headerRight: () => (
            <Filter size={24} color={colors.text} style={{ marginRight: 16 }} />
          ),
        }} 
      />
      
      <SearchBar />
      <CategoryFilter />
      
      <FlatList
        data={filteredSubmissions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No price submissions found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Try adjusting your filters or search query</Text>
          </View>
        }
      />
      
      <DonateButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});