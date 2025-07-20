import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, Award, Upload, MapPin, Moon, Sun } from 'lucide-react-native';
import PriceCard from '@/components/PriceCard';
import DonateButton from '@/components/DonateButton';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { users } from '@/mocks/data';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, toggleTheme, isDark } = useTheme();
  
  // Fix: Use separate selector to avoid infinite loop
  const submissions = useAppStore(state => state.submissions);
  
  // Mock current user (in a real app, this would come from authentication)
  const currentUser = users[0];
  
  // Filter submissions by current user
  const userSubmissions = submissions.filter(sub => sub.userId === currentUser.id);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable onPress={toggleTheme} style={styles.themeButton}>
                {isDark ? (
                  <Sun size={24} color={colors.text} />
                ) : (
                  <Moon size={24} color={colors.text} />
                )}
              </Pressable>
              <Pressable onPress={() => {}}>
                <Settings size={24} color={colors.text} style={{ marginRight: 16 }} />
              </Pressable>
            </View>
          ),
        }} 
      />
      
      <View style={[styles.profileHeader, { borderBottomColor: colors.border }]}>
        <Image 
          source={{ uri: currentUser.avatar }} 
          style={styles.avatar} 
        />
        <Text style={[styles.userName, { color: colors.text }]}>{currentUser.name}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{currentUser.submissionCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Submissions</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{currentUser.upvotesReceived}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upvotes</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Award size={24} color={colors.primary} />
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Top Contributor</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.submissionsHeader}>
        <Text style={[styles.submissionsTitle, { color: colors.text }]}>Your Submissions</Text>
        <Pressable 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/add')}
        >
          <Upload size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Price</Text>
        </Pressable>
      </View>
      
      <FlatList
        data={userSubmissions}
        renderItem={({ item }) => <PriceCard submission={item} compact />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MapPin size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No submissions yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Start contributing by adding your first price submission
            </Text>
            <Pressable 
              style={[styles.emptyAddButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/add')}
            >
              <Text style={styles.emptyAddButtonText}>Add Your First Price</Text>
            </Pressable>
          </View>
        }
      />
      
      <DonateButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    marginRight: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  submissionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  submissionsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});