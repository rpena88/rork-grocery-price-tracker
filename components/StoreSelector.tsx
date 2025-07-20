import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { MapPin, ChevronDown, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { stores } from '@/mocks/data';
import { Store } from '@/types';

type StoreSelectorProps = {
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
};

export default function StoreSelector({ selectedStore, onStoreSelect }: StoreSelectorProps) {
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
      style={styles.storeItem} 
      onPress={() => handleStoreSelect(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.storeImage} />
      ) : (
        <View style={styles.storeImagePlaceholder}>
          <MapPin size={16} color={Colors.textSecondary} />
        </View>
      )}
      <View style={styles.storeDetails}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeAddress}>{item.address}, {item.city}</Text>
      </View>
    </Pressable>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Store</Text>
      
      <Pressable style={styles.selector} onPress={toggleDropdown}>
        {selectedStore ? (
          <View style={styles.selectedStore}>
            {selectedStore.imageUrl ? (
              <Image source={{ uri: selectedStore.imageUrl }} style={styles.selectedStoreImage} />
            ) : (
              <View style={styles.storeImagePlaceholder}>
                <MapPin size={16} color={Colors.textSecondary} />
              </View>
            )}
            <View style={styles.selectedStoreDetails}>
              <Text style={styles.selectedStoreName}>{selectedStore.name}</Text>
              <Text style={styles.selectedStoreAddress}>
                {selectedStore.address}, {selectedStore.city}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <MapPin size={20} color={Colors.textSecondary} />
            <Text style={styles.placeholder}>Select a store</Text>
          </View>
        )}
        <ChevronDown size={20} color={Colors.textSecondary} />
      </Pressable>
      
      {isOpen && (
        <View style={styles.dropdown}>
          <View style={styles.searchContainer}>
            <Search size={16} color={Colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>Search stores...</Text>
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
    color: Colors.text,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.card,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
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
    borderBottomColor: Colors.border,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    borderBottomColor: Colors.border,
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
    backgroundColor: Colors.border,
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
    color: Colors.text,
  },
  storeAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  selectedStoreAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});