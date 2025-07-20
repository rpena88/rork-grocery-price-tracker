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
  
  const handleSubmit = () => {
    if (!selectedProduct || !selectedStore || !price || media.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all fields and add at least one photo, video, or receipt.');
      return;
    }
    
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
    
    addSubmission(newSubmission);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert(
      'Price Submitted',
      'Thank you for contributing to the community!',
      [{ text: 'OK', onPress: () => router.push('/') }]
    );
  };
  
  const handleMediaChange = (newMedia: { uri: string; type: 'image' | 'video' | 'receipt' }[]) => {
    setMedia(newMedia);
  };
  
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
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
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
});