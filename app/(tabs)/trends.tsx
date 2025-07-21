import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';
import DonateButton from '@/components/DonateButton';
import { useTheme } from '@/hooks/useTheme';
import { priceSubmissions } from '@/mocks/data';

type TrendData = {
  productId: string;
  productName: string;
  productImage?: string;
  submissions: typeof priceSubmissions;
  oldestPrice: number;
  newestPrice: number;
  priceDifference: number;
  percentChange: string;
  lowestPrice: number;
  highestPrice: number;
  cheapestStore: {
    storeId: string;
    storeName: string;
    price: number;
    date: string;
  } | null;
  trend: 'up' | 'down' | 'stable';
};

export default function TrendsScreen() {
  const { colors } = useTheme();
  
  const trends = useMemo(() => {
    // Group submissions by product
    const productGroups = priceSubmissions.reduce((groups, submission) => {
      if (!groups[submission.productId]) {
        groups[submission.productId] = {
          productId: submission.productId,
          productName: submission.productName,
          productImage: submission.productImage,
          submissions: [],
        };
      }
      groups[submission.productId].submissions.push(submission);
      return groups;
    }, {} as Record<string, { productId: string; productName: string; productImage?: string; submissions: typeof priceSubmissions }>);
    
    // Calculate price trends
    const trendsData = Object.values(productGroups).map(group => {
      const sortedSubmissions = [...group.submissions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const oldestPrice = sortedSubmissions[0]?.price || 0;
      const newestPrice = sortedSubmissions[sortedSubmissions.length - 1]?.price || 0;
      const priceDifference = newestPrice - oldestPrice;
      const percentChange = oldestPrice > 0 
        ? ((priceDifference / oldestPrice) * 100).toFixed(1)
        : '0.0';
      
      const lowestPrice = Math.min(...sortedSubmissions.map(s => s.price));
      const highestPrice = Math.max(...sortedSubmissions.map(s => s.price));
      
      // Find store with lowest current price
      const storeGroups = sortedSubmissions.reduce((stores, sub) => {
        if (!stores[sub.storeId]) {
          stores[sub.storeId] = {
            storeId: sub.storeId,
            storeName: sub.storeName,
            submissions: [],
          };
        }
        stores[sub.storeId].submissions.push(sub);
        return stores;
      }, {} as Record<string, { storeId: string; storeName: string; submissions: typeof priceSubmissions }>);
      
      const storesWithLatestPrices = Object.values(storeGroups).map(store => {
        const latestSubmission = [...store.submissions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        return {
          storeId: store.storeId,
          storeName: store.storeName,
          price: latestSubmission.price,
          date: latestSubmission.date,
        };
      });
      
      const cheapestStore = [...storesWithLatestPrices].sort((a, b) => a.price - b.price)[0] || null;
      
      return {
        ...group,
        oldestPrice,
        newestPrice,
        priceDifference,
        percentChange,
        lowestPrice,
        highestPrice,
        cheapestStore,
        trend: priceDifference > 0 ? 'up' : priceDifference < 0 ? 'down' : 'stable',
      } as TrendData;
    });
    
    // Sort trends by percent change (highest first)
    return [...trendsData].sort((a, b) => 
      parseFloat(b.percentChange) - parseFloat(a.percentChange)
    );
  }, []);
  
  const renderHeader = () => (
    <View style={[styles.summaryContainer, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
      <Text style={[styles.summaryTitle, { color: colors.text }]}>Price Trend Summary</Text>
      <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
        Based on {priceSubmissions.length} price submissions across {trends.length} products
      </Text>
    </View>
  );
  
  const renderTrendItem = ({ item: trend }: { item: TrendData }) => (
    <View style={[styles.trendCard, { backgroundColor: colors.card }]}>
      <View style={styles.trendHeader}>
        <Text style={[styles.productName, { color: colors.text }]}>{trend.productName}</Text>
        <View style={[
          styles.trendBadge,
          trend.trend === 'up' ? styles.trendUp : 
          trend.trend === 'down' ? styles.trendDown : 
          styles.trendStable
        ]}>
          {trend.trend === 'up' ? (
            <TrendingUp size={16} color="#fff" />
          ) : trend.trend === 'down' ? (
            <TrendingDown size={16} color="#fff" />
          ) : (
            <DollarSign size={16} color="#fff" />
          )}
          <Text style={styles.trendText}>
            {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '' : ''}
            {trend.percentChange}%
          </Text>
        </View>
      </View>
      
      <View style={styles.priceRow}>
        <View style={styles.priceItem}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Current Avg</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>${trend.newestPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Lowest</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>${trend.lowestPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Highest</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>${trend.highestPrice.toFixed(2)}</Text>
        </View>
      </View>
      
      {trend.cheapestStore && (
        <View style={[styles.bestDealContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.bestDealLabel, { color: colors.textSecondary }]}>Best Current Deal</Text>
          <View style={styles.bestDealContent}>
            <Text style={[styles.bestDealStore, { color: colors.text }]}>{trend.cheapestStore.storeName}</Text>
            <Text style={[styles.bestDealPrice, { color: colors.success }]}>${trend.cheapestStore.price.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Price Trends',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      <FlatList
        data={trends}
        renderItem={renderTrendItem}
        keyExtractor={(item) => item.productId}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      />
      
      <DonateButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  summaryContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
  },
  trendCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  trendUp: {
    backgroundColor: '#DC3545',
  },
  trendDown: {
    backgroundColor: '#28A745',
  },
  trendStable: {
    backgroundColor: '#17A2B8',
  },
  trendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  bestDealContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  bestDealLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  bestDealContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestDealStore: {
    fontSize: 14,
    fontWeight: '500',
  },
  bestDealPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
});