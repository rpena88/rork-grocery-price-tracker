import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThumbsUp, ThumbsDown, MapPin, Calendar, CheckCircle } from 'lucide-react-native';
import { PriceSubmission } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import VerificationModal from './VerificationModal';

type PriceCardProps = {
  submission: PriceSubmission;
  compact?: boolean;
};

export default function PriceCard({ submission, compact = false }: PriceCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const voteSubmission = useAppStore((state) => state.voteSubmission);
  const verifySubmission = useAppStore((state) => state.verifySubmission);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  const formattedDate = new Date(submission.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  const handlePress = () => {
    router.push(`/submission/${submission.id}`);
  };
  
  const handleVote = (voteType: 'up' | 'down') => {
    const newVote = submission.userVoted === voteType ? null : voteType;
    voteSubmission(submission.id, newVote);
  };
  
  const handleVerify = () => {
    setShowVerificationModal(true);
  };
  
  const handleVerificationSubmit = (verification: any) => {
    verifySubmission(submission.id, verification);
  };
  
  return (
    <>
      <Pressable 
        style={[
          styles.container, 
          compact && styles.compactContainer,
          { backgroundColor: colors.card }
        ]} 
        onPress={handlePress}
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: submission.productImage }} 
            style={styles.productImage} 
          />
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]}>{submission.productName}</Text>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${submission.price.toFixed(2)}
            </Text>
            {submission.verifications.length > 0 && (
              <View style={styles.verificationBadge}>
                <CheckCircle size={14} color={colors.success} />
                <Text style={[styles.verificationText, { color: colors.success }]}>
                  {submission.verifications.length} verified
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.storeInfo}>
          <View style={styles.storeRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={[styles.storeName, { color: colors.textSecondary }]}>{submission.storeName}</Text>
          </View>
          <View style={styles.storeRow}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={[styles.date, { color: colors.textSecondary }]}>{formattedDate}</Text>
          </View>
        </View>
        
        {!compact && (
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.userInfo}>
              <Image 
                source={{ uri: submission.userAvatar }} 
                style={styles.avatar} 
              />
              <Text style={[styles.userName, { color: colors.text }]}>{submission.userName}</Text>
            </View>
            
            <View style={styles.votes}>
              <Pressable 
                style={styles.voteButton} 
                onPress={() => handleVote('up')}
              >
                <ThumbsUp 
                  size={18} 
                  color={submission.userVoted === 'up' ? colors.primary : colors.textSecondary} 
                  fill={submission.userVoted === 'up' ? colors.primary : 'transparent'}
                />
                <Text style={[styles.voteCount, { color: colors.textSecondary }]}>{submission.upvotes}</Text>
              </Pressable>
              
              <Pressable 
                style={styles.voteButton} 
                onPress={() => handleVote('down')}
              >
                <ThumbsDown 
                  size={18} 
                  color={submission.userVoted === 'down' ? colors.error : colors.textSecondary} 
                  fill={submission.userVoted === 'down' ? colors.error : 'transparent'}
                />
                <Text style={[styles.voteCount, { color: colors.textSecondary }]}>{submission.downvotes}</Text>
              </Pressable>
              
              <Pressable 
                style={styles.voteButton} 
                onPress={handleVerify}
              >
                <CheckCircle 
                  size={18} 
                  color={submission.userVerified ? colors.success : colors.textSecondary} 
                  fill={submission.userVerified ? colors.success : 'transparent'}
                />
                <Text style={[styles.voteCount, { color: colors.textSecondary }]}>{submission.verifications.length}</Text>
              </Pressable>
            </View>
          </View>
        )}
        
        {submission.mediaUrls.length > 1 && (
          <View style={styles.mediaIndicator}>
            <Text style={styles.mediaCount}>+{submission.mediaUrls.length - 1}</Text>
          </View>
        )}
      </Pressable>
      
      <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerificationSubmit}
        submissionId={submission.id}
        productName={submission.productName}
        price={submission.price}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  compactContainer: {
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  storeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 14,
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
  },
  votes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  voteCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  mediaIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  mediaCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});