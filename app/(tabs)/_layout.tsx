import React from 'react';
import { Tabs } from 'expo-router';
import { Home, PlusCircle, User, BarChart2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Price Feed',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Price',
          tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Price Trends',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}