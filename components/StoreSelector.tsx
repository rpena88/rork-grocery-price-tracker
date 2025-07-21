import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { MapPin, ChevronDown, Search } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { stores } from '@/mocks/data';
import { Store } from '@/types';

type StoreSelectorProps = {
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
};

export default function StoreSelector({ selectedStore, onStoreSelect }: StoreSelectorProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleStoreSelect = (store: Store) => {
    onStoreSelect(store);
    setIsOpen(false);
  };
  
  const renderStoreItem = ({ item }: { item: Store }) => (
    <Pressable 
      style={[styles.storeItem, { borderBottomColor: colors.border }]} 
      onPress={() => handleStoreSelect(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.storeImage} />
      ) : (
        <View style={[styles.storeImagePlaceholder, { backgroundColor: colors.border }]}>
          <MapPin size={16} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.storeDetails}>
        <Text style={[styles.storeName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.storeAddress, { color: colors.textSecondary }]}>{item.address}, {item.city}</Text>
      </View>
    </Pressable>
  );
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Store</Text>
      
      <Pressable 
        style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.card }]} 
        onPress={toggleDropdown}
      >
        {selectedStore ? (
          <View style={styles.selectedStore}>
            {selectedStore.imageUrl ? (
              <Image source={{ uri: selectedStore.imageUrl }} style={styles.selectedStoreImage} />
            ) : (
              <View style={[styles.storeImagePlaceholder, { backgroundColor: colors.border }]}>
                <MapPin size={16} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.selectedStoreDetails}>
              <Text style={[styles.selectedStoreName, { color: colors.text }]}>{selectedStore.name}</Text>
              <Text style={[styles.selectedStoreAddress, { color: colors.textSecondary }]}>
                {selectedStore.address}, {selectedStore.city}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <MapPin size={20} color={colors.textSecondary} />
            <Text style={[styles.placeholder, { color: colors.textSecondary }]}>Select a store</Text>
          </View>
        )}
        <ChevronDown size={20} color={colors.textSecondary} />
      </Pressable>
      
      {isOpen && (
        <View style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
            <Search size={16} color={colors.textSecondary} />
            <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>Search stores...</Text>
          </View>
          
          <FlatList
            data={stores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            style={styles.storeList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    marginLeft: 8,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 300,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  searchPlaceholder: {
    fontSize: 14,
    marginLeft: 8,
  },
  storeList: {
    maxHeight: 240,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  storeImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  storeImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  storeAddress: {
    fontSize: 12,
  },
  selectedStore: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedStoreImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 12,
  },
  selectedStoreDetails: {
    flex: 1,
  },
  selectedStoreName: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedStoreAddress: {
    fontSize: 12,
  },
});