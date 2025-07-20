import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

export default function DonateButton() {
  const { colors } = useTheme();
  
  const handleDonate = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const url = 'https://paypal.me/richardp719';
    
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  };
  
  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.button, { backgroundColor: colors.secondary }]}
        onPress={handleDonate}
      >
        <Heart size={16} color="#fff" fill="#fff" />
        <Text style={styles.buttonText}>Donate to support</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});