import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image, TextInput } from 'react-native';
import { ShoppingBag, ChevronDown, Search, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import { Product } from '@/types';
import AddProductModal from './AddProductModal';

type ProductSelectorProps = {
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
};

export default function ProductSelector({ selectedProduct, onProductSelect }: ProductSelectorProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  // Get products from store
  const products = useAppStore(state => state.products);
  const addProduct = useAppStore(state => state.addProduct);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  const handleAddNewProduct = () => {
    setIsOpen(false);
    setShowAddProductModal(true);
  };
  
  const handleProductAdded = (newProduct: Product) => {
    addProduct(newProduct);
    onProductSelect(newProduct);
  };
  
  const filteredProducts = searchQuery
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <Pressable 
      style={[styles.productItem, { borderBottomColor: colors.border }]} 
      onPress={() => handleProductSelect(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImagePlaceholder, { backgroundColor: colors.border }]}>
          <ShoppingBag size={16} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.productDetails}>
        <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.productCategory, { color: colors.textSecondary }]}>{item.category}</Text>
      </View>
    </Pressable>
  );
  
  const renderAddNewProductItem = () => (
    <Pressable 
      style={[styles.addProductItem, { borderBottomColor: colors.border, backgroundColor: colors.card }]} 
      onPress={handleAddNewProduct}
    >
      <View style={[styles.addProductIcon, { backgroundColor: colors.primary }]}>
        <Plus size={16} color="#fff" />
      </View>
      <View style={styles.addProductDetails}>
        <Text style={[styles.addProductText, { color: colors.primary }]}>Add New Product</Text>
        <Text style={[styles.addProductSubtext, { color: colors.textSecondary }]}>
          Can't find your product? Add it here
        </Text>
      </View>
    </Pressable>
  );
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Product</Text>
      
      <Pressable 
        style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.card }]} 
        onPress={toggleDropdown}
      >
        {selectedProduct ? (
          <View style={styles.selectedProduct}>
            {selectedProduct.imageUrl ? (
              <Image source={{ uri: selectedProduct.imageUrl }} style={styles.selectedProductImage} />
            ) : (
              <View style={[styles.productImagePlaceholder, { backgroundColor: colors.border }]}>
                <ShoppingBag size={16} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.selectedProductDetails}>
              <Text style={[styles.selectedProductName, { color: colors.text }]}>{selectedProduct.name}</Text>
              <Text style={[styles.selectedProductCategory, { color: colors.textSecondary }]}>{selectedProduct.category}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <ShoppingBag size={20} color={colors.textSecondary} />
            <Text style={[styles.placeholder, { color: colors.textSecondary }]}>Select a product</Text>
          </View>
        )}
        <ChevronDown size={20} color={colors.textSecondary} />
      </Pressable>
      
      {isOpen && (
        <View style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
            <Search size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            style={styles.productList}
            ListHeaderComponent={renderAddNewProductItem}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No products found</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Try a different search or add a new product
                </Text>
              </View>
            }
          />
        </View>
      )}
      
      <AddProductModal
        visible={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAddProduct={handleProductAdded}
      />
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    padding: 0,
  },
  productList: {
    maxHeight: 240,
  },
  addProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 2,
  },
  addProductIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addProductDetails: {
    flex: 1,
  },
  addProductText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addProductSubtext: {
    fontSize: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
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
  },
  productCategory: {
    fontSize: 12,
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
  },
  selectedProductCategory: {
    fontSize: 12,
  },
  emptyList: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
  },
});