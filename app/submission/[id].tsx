import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Calendar, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, CheckCircle, User } from 'lucide-react-native';
import DonateButton from '@/components/DonateButton';
import VerificationModal from '@/components/VerificationModal';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  // Fix: Use separate selectors to avoid infinite loop
  const submission = useAppStore(state => state.submissions.find(s => s.id === id));
  const voteSubmission = useAppStore(state => state.voteSubmission);
  const verifySubmission = useAppStore(state => state.verifySubmission);
  
  if (!submission) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text }]}>Submission not found</Text>
        <Pressable 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }
  
  const formattedDate = new Date(submission.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
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
  
  const nextImage = () => {
    if (currentImageIndex < submission.mediaUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: submission.productName,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: submission.mediaUrls[currentImageIndex] }} 
            style={styles.mediaImage} 
            resizeMode="cover"
          />
          
          {submission.mediaUrls.length > 1 && (
            <>
              <Pressable 
                style={[styles.navButton, styles.prevButton]}
                onPress={prevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft 
                  size={24} 
                  color={currentImageIndex === 0 ? 'rgba(255,255,255,0.3)' : '#fff'} 
                />
              </Pressable>
              
              <Pressable 
                style={[styles.navButton, styles.nextButton]}
                onPress={nextImage}
                disabled={currentImageIndex === submission.mediaUrls.length - 1}
              >
                <ChevronRight 
                  size={24} 
                  color={currentImageIndex === submission.mediaUrls.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff'} 
                />
              </Pressable>
              
              <View style={styles.pagination}>
                {submission.mediaUrls.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive
                    ]} 
                  />
                ))}
              </View>
            </>
          )}
          
          <View style={styles.mediaTypeIndicator}>
            <Text style={styles.mediaTypeText}>
              {submission.mediaTypes[currentImageIndex].toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.priceContainer}>
            <View>
              <Text style={[styles.price, { color: colors.primary }]}>${submission.price.toFixed(2)}</Text>
              {submission.verifications.length > 0 && (
                <View style={styles.verificationBadge}>
                  <CheckCircle size={16} color={colors.success} />
                  <Text style={[styles.verificationText, { color: colors.success }]}>
                    {submission.verifications.length} verified
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.votes}>
              <Pressable 
                style={styles.voteButton} 
                onPress={() => handleVote('up')}
              >
                <ThumbsUp 
                  size={20} 
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
                  size={20} 
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
                  size={20} 
                  color={submission.userVerified ? colors.success : colors.textSecondary} 
                  fill={submission.userVerified ? colors.success : 'transparent'}
                />
                <Text style={[styles.voteCount, { color: colors.textSecondary }]}>{submission.verifications.length}</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={[styles.productName, { color: colors.text }]}>{submission.productName}</Text>
            
            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>{submission.storeName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>{formattedDate}</Text>
            </View>
          </View>
          
          <View style={[styles.userContainer, { backgroundColor: colors.card }]}>
            <Image 
              source={{ uri: submission.userAvatar }} 
              style={styles.userAvatar} 
            />
            <View>
              <Text style={[styles.submittedBy, { color: colors.textSecondary }]}>Submitted by</Text>
              <Text style={[styles.userName, { color: colors.text }]}>{submission.userName}</Text>
            </View>
          </View>
          
          {submission.verifications.length > 0 && (
            <View style={[styles.verificationsContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.verificationsTitle, { color: colors.text }]}>
                Price Verifications ({submission.verifications.length})
              </Text>
              <Text style={[styles.verificationsSubtitle, { color: colors.textSecondary }]}>
                Other users have confirmed this price
              </Text>
              
              <View style={styles.verificationsList}>
                {submission.verifications.slice(0, 3).map((verification) => (
                  <View key={verification.id} style={styles.verificationItem}>
                    <Image 
                      source={{ uri: verification.userAvatar }} 
                      style={styles.verificationAvatar} 
                    />
                    <View style={styles.verificationInfo}>
                      <Text style={[styles.verificationUserName, { color: colors.text }]}>
                        {verification.userName}
                      </Text>
                      <Text style={[styles.verificationDate, { color: colors.textSecondary }]}>
                        {new Date(verification.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <CheckCircle size={16} color={colors.success} />
                  </View>
                ))}
                
                {submission.verifications.length > 3 && (
                  <Text style={[styles.moreVerifications, { color: colors.textSecondary }]}>
                    +{submission.verifications.length - 3} more verifications
                  </Text>
                )}
              </View>
            </View>
          )}
          
          <View style={[styles.helpfulContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.helpfulTitle, { color: colors.text }]}>Help verify this price</Text>
            <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
              Have you seen this price recently? Help the community by verifying it with a photo.
            </Text>
            <View style={styles.helpfulButtons}>
              <Pressable 
                style={[
                  styles.helpfulButton,
                  submission.userVoted === 'up' && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => handleVote('up')}
              >
                <ThumbsUp 
                  size={16} 
                  color={submission.userVoted === 'up' ? '#fff' : colors.text} 
                />
                <Text 
                  style={[
                    styles.helpfulButtonText,
                    { color: submission.userVoted === 'up' ? '#fff' : colors.text }
                  ]}
                >
                  Yes, accurate
                </Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.helpfulButton,
                  submission.userVoted === 'down' && { backgroundColor: colors.error, borderColor: colors.error }
                ]}
                onPress={() => handleVote('down')}
              >
                <ThumbsDown 
                  size={16} 
                  color={submission.userVoted === 'down' ? '#fff' : colors.text} 
                />
                <Text 
                  style={[
                    styles.helpfulButtonText,
                    { color: submission.userVoted === 'down' ? '#fff' : colors.text }
                  ]}
                >
                  No, outdated
                </Text>
              </Pressable>
            </View>
            
            <Pressable 
              style={[
                styles.verifyButton,
                { backgroundColor: submission.userVerified ? colors.success : colors.primary }
              ]}
              onPress={handleVerify}
              disabled={submission.userVerified}
            >
              <CheckCircle size={16} color="#fff" />
              <Text style={styles.verifyButtonText}>
                {submission.userVerified ? 'Already Verified' : 'Verify with Photo'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      
      <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerificationSubmit}
        submissionId={submission.id}
        productName={submission.productName}
        price={submission.price}
      />
      
      <DonateButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mediaContainer: {
    width: '100%',
    height: width * 0.8,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaTypeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mediaTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 16,
  },
  content: {
    padding: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
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
    fontSize: 16,
    marginLeft: 4,
  },
  infoContainer: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  submittedBy: {
    fontSize: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verificationsContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  verificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  verificationsSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  verificationsList: {
    gap: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationUserName: {
    fontSize: 14,
    fontWeight: '500',
  },
  verificationDate: {
    fontSize: 12,
  },
  moreVerifications: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  helpfulContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  helpfulTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helpfulText: {
    fontSize: 14,
    marginBottom: 16,
  },
  helpfulButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  helpfulButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  helpfulButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});