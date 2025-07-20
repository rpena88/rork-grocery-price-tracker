import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { PriceVerification } from '@/types';
import { users } from '@/mocks/data';

type VerificationModalProps = {
  visible: boolean;
  onClose: () => void;
  onVerify: (verification: PriceVerification) => void;
  submissionId: string;
  productName: string;
  price: number;
};

export default function VerificationModal({ 
  visible, 
  onClose, 
  onVerify, 
  submissionId, 
  productName, 
  price 
}: VerificationModalProps) {
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required to verify prices.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required to verify prices.');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Image Required', 'Please select or take a photo to verify this price.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock current user (in a real app, this would come from authentication)
    const currentUser = users[0];
    
    const verification: PriceVerification = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      imageUrl: selectedImage,
      date: new Date().toISOString(),
    };
    
    // Simulate API call delay
    setTimeout(() => {
      onVerify(verification);
      setIsSubmitting(false);
      setSelectedImage(null);
      onClose();
      Alert.alert('Verification Submitted', 'Thank you for helping verify this price!');
    }, 1000);
  };
  
  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };
  
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
          <Text style={[styles.title, { color: colors.text }]}>Verify Price</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.content}>
          <View style={[styles.priceInfo, { backgroundColor: colors.card }]}>
            <Text style={[styles.productName, { color: colors.text }]}>{productName}</Text>
            <Text style={[styles.price, { color: colors.primary }]}>${price.toFixed(2)}</Text>
          </View>
          
          <Text style={[styles.instructions, { color: colors.textSecondary }]}>
            Help verify this price by taking a photo of the product with its price tag or receipt.
          </Text>
          
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <Pressable 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <X size={16} color="#fff" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <Pressable 
                style={[styles.imagePickerButton, { backgroundColor: colors.primary }]}
                onPress={takePhoto}
              >
                <Camera size={24} color="#fff" />
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.imagePickerButton, { backgroundColor: colors.secondary }]}
                onPress={pickImage}
              >
                <Camera size={24} color="#fff" />
                <Text style={styles.imagePickerText}>Choose from Gallery</Text>
              </Pressable>
            </View>
          )}
          
          <Pressable 
            style={[
              styles.submitButton,
              { backgroundColor: selectedImage ? colors.success : colors.border },
              isSubmitting && styles.submittingButton,
            ]}
            onPress={handleSubmit}
            disabled={!selectedImage || isSubmitting}
          >
            <Check size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Verification'}
            </Text>
          </Pressable>
        </View>
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
    padding: 16,
  },
  priceInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  imagePickerContainer: {
    gap: 12,
    marginBottom: 24,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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