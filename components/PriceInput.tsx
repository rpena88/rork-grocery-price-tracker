import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Colors from '@/constants/colors';

type PriceInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function PriceInput({ value, onChangeText }: PriceInputProps) {
  const handleChangeText = (text: string) => {
    // Only allow numbers and a single decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = filtered.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }
    
    onChangeText(filtered);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    paddingVertical: 12,
  },
});