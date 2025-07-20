import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';
import DonateButton from '@/components/DonateButton';
import Colors from '@/constants/colors';
import { priceSubmissions } from '@/mocks/data';

export default function TrendsScreen() {
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
  const trends = Object.values(productGroups).map(group => {
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
    
    const cheapestStore = [...storesWithLatestPrices].sort((a, b) => a.price - b.price)[0];
    
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
    };
  });
  
  // Sort trends by percent change (highest first)
  const sortedTrends = [...trends].sort((a, b) => 
    parseFloat(b.percentChange) - parseFloat(a.percentChange)
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Price Trends' }} />
      
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Price Trend Summary</Text>
          <Text style={styles.summaryText}>
            Based on {priceSubmissions.length} price submissions across {Object.keys(productGroups).length} products
          </Text>
        </View>
        
        {sortedTrends.map(trend => (
          <View key={trend.productId} style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Text style={styles.productName}>{trend.productName}</Text>
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
                <Text style={styles.priceLabel}>Current Avg</Text>
                <Text style={styles.priceValue}>${trend.newestPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Lowest</Text>
                <Text style={styles.priceValue}>${trend.lowestPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Highest</Text>
                <Text style={styles.priceValue}>${trend.highestPrice.toFixed(2)}</Text>
              </View>
            </View>
            
            {trend.cheapestStore && (
              <View style={styles.bestDealContainer}>
                <Text style={styles.bestDealLabel}>Best Current Deal</Text>
                <View style={styles.bestDealContent}>
                  <Text style={styles.bestDealStore}>{trend.cheapestStore.storeName}</Text>
                  <Text style={styles.bestDealPrice}>${trend.cheapestStore.price.toFixed(2)}</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <DonateButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  summaryContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  trendCard: {
    backgroundColor: Colors.card,
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
    color: Colors.text,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  trendUp: {
    backgroundColor: Colors.error,
  },
  trendDown: {
    backgroundColor: Colors.success,
  },
  trendStable: {
    backgroundColor: Colors.info,
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
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  bestDealContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bestDealLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  bestDealPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.success,
  },
});