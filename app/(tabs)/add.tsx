import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import ProductSelector from '@/components/ProductSelector';
import StoreSelector from '@/components/StoreSelector';
import PriceInput from '@/components/PriceInput';
import MediaPicker from '@/components/MediaPicker';
import DonateButton from '@/components/DonateButton';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { Product, Store, PriceSubmission } from '@/types';
import { users } from '@/mocks/data';

export default function AddPriceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const addSubmission = useAppStore((state) => state.addSubmission);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [price, setPrice] = useState('');
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' | 'receipt' }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!selectedProduct || !selectedStore || !price || media.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all fields and add at least one photo, video, or receipt.');
      return;
    }
    
    if (parseFloat(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than $0.00.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock user data (in a real app, this would come from authentication)
    const currentUser = users[0];
    
    const newSubmission: PriceSubmission = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.imageUrl,
      storeId: selectedStore.id,
      storeName: selectedStore.name,
      price: parseFloat(price),
      currency: 'USD',
      date: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      mediaUrls: media.map(item => item.uri),
      mediaTypes: media.map(item => item.type),
      upvotes: 0,
      downvotes: 0,
      verifications: [],
    };
    
    // Simulate API call delay
    setTimeout(() => {
      addSubmission(newSubmission);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setIsSubmitting(false);
      
      Alert.alert(
        'Price Submitted Successfully! 🎉',
        `Thank you for contributing to the community!\n\n${selectedProduct.name} - $${parseFloat(price).toFixed(2)} at ${selectedStore.name} has been added to the price feed.`,
        [
          {
            text: 'View in Feed',
            onPress: () => {
              // Reset form
              setSelectedProduct(null);
              setSelectedStore(null);
              setPrice('');
              setMedia([]);
              router.push('/');
            }
          },
          {
            text: 'Add Another Price',
            onPress: () => {
              // Reset form
              setSelectedProduct(null);
              setSelectedStore(null);
              setPrice('');
              setMedia([]);
            }
          }
        ]
      );
    }, 1500);
  };
  
  const handleMediaChange = (newMedia: { uri: string; type: 'image' | 'video' | 'receipt' }[]) => {
    setMedia(newMedia);
  };
  
  const isFormValid = selectedProduct && selectedStore && price && parseFloat(price) > 0 && media.length > 0;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'Add Price',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <Pressable 
              style={[
                styles.headerSubmitButton, 
                { 
                  backgroundColor: isFormValid ? colors.primary : colors.border,
                  opacity: isSubmitting ? 0.7 : 1
                }
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              <Check size={16} color="#fff" />
              <Text style={styles.headerSubmitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}>
        <View style={styles.formContainer}>
          <ProductSelector 
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
          />
          
          <StoreSelector 
            selectedStore={selectedStore}
            onStoreSelect={setSelectedStore}
          />
          
          <PriceInput 
            value={price}
            onChangeText={setPrice}
          />
          
          <MediaPicker onMediaChange={handleMediaChange} />
          
          <View style={[styles.infoContainer, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Why share prices?</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              By sharing prices, you help others find the best deals and track inflation over time.
              Your contributions make grocery shopping more transparent for everyone.
            </Text>
          </View>
          
          {/* Main Submit Button */}
          <Pressable 
            style={[
              styles.submitButton,
              { 
                backgroundColor: isFormValid ? colors.primary : colors.border,
                opacity: isSubmitting ? 0.7 : 1
              }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            <Check size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting Price...' : 'Submit Price'}
            </Text>
          </Pressable>
          
          {!isFormValid && (
            <View style={[styles.validationContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.validationTitle, { color: colors.text }]}>Required to submit:</Text>
              <Text style={[styles.validationItem, { color: !selectedProduct ? colors.error : colors.success }]}>
                {!selectedProduct ? '✗' : '✓'} Select a product
              </Text>
              <Text style={[styles.validationItem, { color: !selectedStore ? colors.error : colors.success }]}>
                {!selectedStore ? '✗' : '✓'} Select a store
              </Text>
              <Text style={[styles.validationItem, { color: !price || parseFloat(price) <= 0 ? colors.error : colors.success }]}>
                {!price || parseFloat(price) <= 0 ? '✗' : '✓'} Enter a valid price
              </Text>
              <Text style={[styles.validationItem, { color: media.length === 0 ? colors.error : colors.success }]}>
                {media.length === 0 ? '✗' : '✓'} Add at least one photo/video/receipt
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <DonateButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  formContainer: {
    padding: 16,
  },
  headerSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
  },
  headerSubmitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 24,
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
  validationContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  validationItem: {
    fontSize: 12,
    marginBottom: 4,
  },
});