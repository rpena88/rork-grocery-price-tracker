import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { X, Check, Camera, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Product } from '@/types';
import { categories } from '@/mocks/data';

type AddProductModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
};

export default function AddProductModal({ visible, onClose, onAddProduct }: AddProductModalProps) {
  const { colors } = useTheme();
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const availableCategories = categories.filter(cat => cat !== 'All');
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required to add product images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProductImage(result.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required to add product images.');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProductImage(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.alert('Product Name Required', 'Please enter a product name.');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Category Required', 'Please select a category for this product.');
      return;
    }
    
    setIsSubmitting(true);
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName.trim(),
      category: selectedCategory,
      imageUrl: productImage || undefined,
    };
    
    // Simulate API call delay
    setTimeout(() => {
      onAddProduct(newProduct);
      setIsSubmitting(false);
      resetForm();
      onClose();
      Alert.alert('Product Added', `${productName} has been added to the product list!`);
    }, 1000);
  };
  
  const resetForm = () => {
    setProductName('');
    setSelectedCategory('');
    setProductImage(null);
    setShowCategoryDropdown(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const isFormValid = productName.trim() && selectedCategory;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Add New Product</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Product Name *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={productName}
                onChangeText={setProductName}
                placeholder="Enter product name"
                placeholderTextColor={colors.textSecondary}
                maxLength={50}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
              <Pressable 
                style={[styles.categorySelector, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={[styles.categoryText, { color: selectedCategory ? colors.text : colors.textSecondary }]}>
                  {selectedCategory || 'Select a category'}
                </Text>
              </Pressable>
              
              {showCategoryDropdown && (
                <View style={[styles.categoryDropdown, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <ScrollView style={styles.categoryList} nestedScrollEnabled>
                    {availableCategories.map((category) => (
                      <Pressable
                        key={category}
                        style={[styles.categoryItem, { borderBottomColor: colors.border }]}
                        onPress={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <Text style={[styles.categoryItemText, { color: colors.text }]}>{category}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Product Image (Optional)</Text>
              
              {productImage ? (
                <View style={styles.imageContainer}>
                  <View style={styles.imagePreview}>
                    <Text style={[styles.imagePreviewText, { color: colors.text }]}>Image selected</Text>
                    <Pressable 
                      style={styles.removeImageButton}
                      onPress={() => setProductImage(null)}
                    >
                      <X size={16} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.imagePickerContainer}>
                  <Pressable 
                    style={[styles.imagePickerButton, { backgroundColor: colors.primary }]}
                    onPress={takePhoto}
                  >
                    <Camera size={20} color="#fff" />
                    <Text style={styles.imagePickerText}>Take Photo</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.imagePickerButton, { backgroundColor: colors.secondary }]}
                    onPress={pickImage}
                  >
                    <ImageIcon size={20} color="#fff" />
                    <Text style={styles.imagePickerText}>Choose Image</Text>
                  </Pressable>
                </View>
              )}
            </View>
            
            <View style={[styles.infoContainer, { backgroundColor: colors.card, borderLeftColor: colors.info }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Adding a New Product</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Make sure the product doesn't already exist in the list. Adding duplicate products makes it harder for others to find accurate price information.
              </Text>
            </View>
            
            <Pressable 
              style={[
                styles.submitButton,
                { backgroundColor: isFormValid ? colors.success : colors.border },
                isSubmitting && styles.submittingButton,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  categorySelector: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categoryText: {
    fontSize: 16,
  },
  categoryDropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryList: {
    maxHeight: 180,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryItemText: {
    fontSize: 14,
  },
  imageContainer: {
    marginTop: 8,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#28A745',
    borderRadius: 8,
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
  },
  imagePreviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeImageButton: {
    padding: 4,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  imagePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submittingButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});