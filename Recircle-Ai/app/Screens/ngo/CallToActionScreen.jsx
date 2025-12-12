import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, Chip, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CallToActionScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  
  const matchData = {
    category: 'Food Staples',
    from: 'The Corner Store',
    distance: '2.5 miles away',
    description: 'Fresh groceries and essential food items available for immediate pickup. Includes canned goods, fresh produce, and dairy products.',
    contact: {
      phone: '(555) 123-4567',
      hours: 'Open until 8:00 PM',
      address: '123 Main Street, Cityville'
    },
    rating: '4.8',
    reviews: '127',
    deliveryTime: '15-20 min'
  };

  const handleGetDirections = () => {
    // In a real app, this would open maps or navigation
    console.log('Get directions pressed');
  };

  const handleContact = () => {
    console.log('Contact pressed');
  };

  const handleBackToHome = () => {
    router.push('/Screens/ngo/ViewDonationsForNGO');
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E0E7FF', '#F8FAFC']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: top + 16 }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <View style={styles.headerContent}>
            <Text variant="titleLarge" style={styles.headerTitle}>Match Found!</Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>Step 3 of 3</Text>
          </View>
        </View>

        {/* Success Animation */}
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <IconButton
              icon="check"
              iconColor="#FFFFFF"
              size={40}
              style={styles.successIcon}
            />
          </View>
          <Text variant="headlineMedium" style={styles.successTitle}>
            Perfect Match Found!
          </Text>
          <Text variant="bodyLarge" style={styles.successSubtitle}>
            We found the best option for your needs
          </Text>
        </View>

        {/* Match Details Card */}
        <Card style={styles.matchCard}>
          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardHeader}
          >
            <View style={styles.cardHeaderContent}>
              <View style={styles.categoryBadge}>
                <IconButton
                  icon="food"
                  iconColor="#FFFFFF"
                  size={16}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>{matchData.category}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <IconButton
                  icon="star"
                  iconColor="#FFD700"
                  size={16}
                  style={styles.ratingIcon}
                />
                <Text style={styles.ratingText}>{matchData.rating}</Text>
                <Text style={styles.reviewsText}>({matchData.reviews})</Text>
              </View>
            </View>
          </LinearGradient>

          <Card.Content style={styles.cardContent}>
            {/* Provider Info */}
            <View style={styles.providerSection}>
              <Text variant="titleLarge" style={styles.providerName}>
                {matchData.from}
              </Text>
              <View style={styles.distanceContainer}>
                <IconButton
                  icon="map-marker-distance"
                  iconColor="#10B981"
                  size={16}
                  style={styles.distanceIcon}
                />
                <Text variant="bodyMedium" style={styles.distance}>
                  {matchData.distance}
                </Text>
                <View style={styles.deliveryTime}>
                  <Text style={styles.deliveryTimeText}>{matchData.deliveryTime}</Text>
                </View>
              </View>
            </View>

            <Text variant="bodyMedium" style={styles.description}>
              {matchData.description}
            </Text>

            {/* Map Placeholder */}
            <View style={styles.mapSection}>
              <Text variant="titleSmall" style={styles.mapTitle}>Location</Text>
              <View style={styles.mapPlaceholder}>
                <IconButton
                  icon="map"
                  iconColor="#6B7280"
                  size={40}
                  style={styles.mapIcon}
                />
                <Text variant="bodyMedium" style={styles.mapText}>
                  Interactive Map View
                </Text>
                <Text variant="bodySmall" style={styles.mapSubtext}>
                  {matchData.contact.address}
                </Text>
                <View style={styles.mapOverlay}>
                  <Text style={styles.mapOverlayText}>Tap to view in Maps</Text>
                </View>
              </View>
            </View>

            {/* Contact Info */}
            <View style={styles.contactSection}>
              <Text variant="titleSmall" style={styles.contactTitle}>Contact Information</Text>
              <View style={styles.contactItems}>
                <View style={styles.contactItem}>
                  <IconButton
                    icon="phone"
                    iconColor="#4F46E5"
                    size={20}
                    style={styles.contactIcon}
                  />
                  <Text variant="bodyMedium" style={styles.contactText}>
                    {matchData.contact.phone}
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <IconButton
                    icon="clock-outline"
                    iconColor="#4F46E5"
                    size={20}
                    style={styles.contactIcon}
                  />
                  <Text variant="bodyMedium" style={styles.contactText}>
                    {matchData.contact.hours}
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <IconButton
                    icon="map-marker-outline"
                    iconColor="#4F46E5"
                    size={20}
                    style={styles.contactIcon}
                  />
                  <Text variant="bodyMedium" style={styles.contactText}>
                    {matchData.contact.address}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleGetDirections}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="navigation-variant"
          >
            Get Directions
          </Button>
          
          <View style={styles.secondaryButtons}>
            <Button
              mode="outlined"
              onPress={handleContact}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.secondaryButtonLabel}
              icon="phone"
            >
              Contact
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleBackToHome}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.secondaryButtonLabel}
              icon="home"
            >
              Back Home
            </Button>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    margin: 0,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successIcon: {
    margin: 0,
  },
  successTitle: {
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
  },
  matchCard: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  cardHeader: {
    padding: 20,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryIcon: {
    margin: 0,
    marginRight: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    margin: 0,
    marginRight: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
  reviewsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  cardContent: {
    padding: 0,
  },
  providerSection: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  providerName: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    margin: 0,
    marginRight: 8,
  },
  distance: {
    color: '#6B7280',
    marginRight: 16,
  },
  deliveryTime: {
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryTimeText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 12,
  },
  description: {
    color: '#6B7280',
    lineHeight: 20,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mapSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mapTitle: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    position: 'relative',
  },
  mapIcon: {
    margin: 0,
    marginBottom: 8,
  },
  mapText: {
    color: '#6B7280',
    marginBottom: 4,
  },
  mapSubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingVertical: 8,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  mapOverlayText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  contactSection: {
    padding: 24,
  },
  contactTitle: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactItems: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    margin: 0,
    marginRight: 12,
  },
  contactText: {
    color: '#374151',
    flex: 1,
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderColor: '#4F46E5',
    borderWidth: 1.5,
  },
  secondaryButtonLabel: {
    fontWeight: '600',
    color: '#4F46E5',
  },
});

export default CallToActionScreen;