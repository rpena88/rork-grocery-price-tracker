import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Receipt, Video, X, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';

type MediaPickerProps = {
  onMediaChange: (media: { uri: string; type: 'image' | 'video' | 'receipt' }[]) => void;
};

export default function MediaPicker({ onMediaChange }: MediaPickerProps) {
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' | 'receipt' }[]>([]);
  
  const pickImage = async (type: 'image' | 'video' | 'receipt') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }
    
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: type === 'video' 
        ? ImagePicker.MediaTypeOptions.Videos 
        : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    };
    
    const result = await ImagePicker.launchImageLibraryAsync(options);
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMedia = { uri: result.assets[0].uri, type };
      const updatedMedia = [...media, newMedia];
      setMedia(updatedMedia);
      onMediaChange(updatedMedia);
    }
  };
  
  const removeMedia = (index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
    onMediaChange(updatedMedia);
  };
  
  const renderMediaTypeIcon = (type: 'image' | 'video' | 'receipt') => {
    switch (type) {
      case 'image':
        return <Camera size={16} color="#fff" />;
      case 'video':
        return <Video size={16} color="#fff" />;
      case 'receipt':
        return <Receipt size={16} color="#fff" />;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Photos, Videos, or Receipts</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaContainer}
      >
        {media.map((item, index) => (
          <View key={index} style={styles.mediaItem}>
            <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
            <View style={styles.mediaTypeIndicator}>
              {renderMediaTypeIcon(item.type)}
            </View>
            <Pressable 
              style={styles.removeButton}
              onPress={() => removeMedia(index)}
            >
              <X size={16} color="#fff" />
            </Pressable>
          </View>
        ))}
        
        {media.length < 5 && (
          <View style={styles.mediaPickerButtons}>
            <Pressable 
              style={[styles.mediaButton, { backgroundColor: Colors.primary }]}
              onPress={() => pickImage('image')}
            >
              <Camera size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Photo</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.mediaButton, { backgroundColor: Colors.secondary }]}
              onPress={() => pickImage('video')}
            >
              <Video size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Video</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.mediaButton, { backgroundColor: Colors.info }]}
              onPress={() => pickImage('receipt')}
            >
              <Receipt size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Receipt</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      
      {media.length === 0 && (
        <View style={styles.emptyState}>
          <Plus size={40} color={Colors.border} />
          <Text style={styles.emptyText}>Add photos, videos, or receipts</Text>
          <Text style={styles.emptySubtext}>Help others by sharing visual proof of prices</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  mediaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  mediaItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  mediaTypeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  mediaPickerButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  mediaButton: {
    width: 80,
    height: 28,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  mediaButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});