import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image, TextInput } from 'react-native';
import { ShoppingBag, ChevronDown, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products } from '@/mocks/data';
import { Product } from '@/types';

type ProductSelectorProps = {
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
};

export default function ProductSelector({ selectedProduct, onProductSelect }: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setIsOpen(false);
  };
  
  const filteredProducts = searchQuery
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <Pressable 
      style={styles.productItem} 
      onPress={() => handleProductSelect(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <ShoppingBag size={16} color={Colors.textSecondary} />
        </View>
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
    </Pressable>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product</Text>
      
      <Pressable style={styles.selector} onPress={toggleDropdown}>
        {selectedProduct ? (
          <View style={styles.selectedProduct}>
            {selectedProduct.imageUrl ? (
              <Image source={{ uri: selectedProduct.imageUrl }} style={styles.selectedProductImage} />
            ) : (
              <View style={styles.productImagePlaceholder}>
                <ShoppingBag size={16} color={Colors.textSecondary} />
              </View>
            )}
            <View style={styles.selectedProductDetails}>
              <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
              <Text style={styles.selectedProductCategory}>{selectedProduct.category}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <ShoppingBag size={20} color={Colors.textSecondary} />
            <Text style={styles.placeholder}>Select a product</Text>
          </View>
        )}
        <ChevronDown size={20} color={Colors.textSecondary} />
      </Pressable>
      
      {isOpen && (
        <View style={styles.dropdown}>
          <View style={styles.searchContainer}>
            <Search size={16} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            style={styles.productList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            }
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    padding: 0,
  },
  productList: {
    maxHeight: 240,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  productCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedProductImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 12,
  },
  selectedProductDetails: {
    flex: 1,
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedProductCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyList: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});