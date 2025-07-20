import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';

export default function SearchBar() {
  const { colors } = useTheme();
  
  // Fix: Use separate selectors to avoid infinite loop
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);
  
  const handleClear = () => {
    setSearchQuery('');
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search products, stores..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});