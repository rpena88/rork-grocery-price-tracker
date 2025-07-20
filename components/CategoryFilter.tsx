import React from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { categories } from '@/mocks/data';
import { useAppStore } from '@/store/useAppStore';

export default function CategoryFilter() {
  const { colors } = useTheme();
  
  // Fix: Use separate selectors to avoid infinite loop
  const filterOptions = useAppStore(state => state.filterOptions);
  const setFilterOptions = useAppStore(state => state.setFilterOptions);
  
  const selectedCategory = filterOptions.category || 'All';
  
  const handleCategoryPress = (category: string) => {
    setFilterOptions({ 
      category: category === 'All' ? undefined : category 
    });
  };
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <Pressable
          key={category}
          style={[
            styles.categoryButton,
            { backgroundColor: colors.card },
            selectedCategory === category && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleCategoryPress(category)}
        >
          <Text
            style={[
              styles.categoryText,
              { color: colors.textSecondary },
              selectedCategory === category && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
});