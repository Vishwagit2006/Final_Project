// File: app/ngo/home.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopNavBar from '../../../components/TopNavBar';
import NgoBottomNav from '../../../components/NgoBottomNav';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample data for top supporters

const COLORS = {
  primary: '#2A9D8F',
  secondary: '#264653',
  accent: '#E76F51',
  background: '#F8F9FA',
  text: '#2B2D42',
  muted: '#8D99AE',
};

const topSupportersData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Donor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    donations: 42,
    rating: 4.9,
    completion: 92,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Volunteer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    donations: 38,
    rating: 4.8,
    completion: 85,
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Community Leader',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    donations: 35,
    rating: 4.9,
    completion: 78,
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Restaurant Owner',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    donations: 31,
    rating: 4.7,
    completion: 72,
  },
  {
    id: 5,
    name: 'Emma Garcia',
    role: 'Food Bank Staff',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    donations: 28,
    rating: 4.8,
    completion: 65,
  },
];
// Add this data structure before component definition
const availableDonations = [
  {
    id: 1,
    title: '20 Dosa',
    quantity: '20 meals',
    distance: '2 km away',
    urgency: 'Urgent',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Freshly made dosa, perfect for a quick meal. Ready for immediate pickup.',
    pickupInstructions: 'Available for pickup between 10 AM and 5 PM. Please bring your own bag.',
    donorName: 'A Local Restaurant',
    donorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    donorRating: 4.5,
  },
  {
    id: 2,
    title: 'Vegetable Meals',
    quantity: '15 meals',
    distance: '0.8 km away',
    urgency: 'High',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    description: 'Nutritious vegetable meals, prepared with fresh ingredients. Ideal for lunch or dinner.',
    pickupInstructions: 'Pickup anytime between 11 AM and 6 PM.',
    donorName: 'Community Kitchen',
    donorAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    donorRating: 4.8,
  },
  {
    id: 3,
    title: 'Fruit Baskets',
    quantity: '10 units',
    distance: '2.1 km away',
    urgency: 'Medium',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba',
    description: 'A variety of fresh and seasonal fruits. Great for sharing or individual consumption.',
    pickupInstructions: 'Pick up before 8 PM today.',
    donorName: 'Local Farm',
    donorAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    donorRating: 4.9,
  },
];

const HomeScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleClaimPress = (donation) => {
    router.push({
      pathname: '/Screens/ngo/Details',
      params: donation,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TopNavBar />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search NGO"
              placeholderTextColor="#aaa"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
              <Ionicons name="options-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Promo Banner */}
          <View style={styles.promoBanner}>
      <View style={styles.promoLabelContainer}>
        <Text style={styles.promoLabel}>PROMO</Text>
      </View>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' }} 
        style={styles.promoImage} 
      />
    </View>

          {/* Requests Summary */}
          <View style={styles.requestsSummary}>
            {[{ count: 12, label: 'Requests Made', color: '#E76F51' }, { count: 3, label: 'Pending Responses', color: '#F4A261' }, { count: 9, label: 'Fulfilled Requests', color: '#2A9D8F' }].map((item, index) => (
              <View key={index} style={[styles.requestCard, { backgroundColor: item.color }]}>
                <Text style={styles.requestCount}>{item.count}</Text>
                <Text style={styles.requestLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Available Donations */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Food Donations</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionAction}>See All</Text>
            </TouchableOpacity>
          </View>

          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.horizontalScroll, { opacity: fadeAnim }]}
            bounces
          >
            {availableDonations.map((donation) => (
              <TouchableOpacity
                key={donation.id}
                activeOpacity={0.9}
                style={styles.donationCard}
                onPress={() => handleClaimPress(donation)}
              >
                <Image
                  source={{ uri: donation.image }}
                  style={styles.donationImage}
                />
                <View style={styles.donationInfo}>
                  <Text style={styles.donationTitle}>{donation.title}</Text>
                  <Text style={styles.donationDistance}>{donation.distance}</Text>
                  <View style={styles.donationActions}>
                    <Text style={styles.urgency}>{donation.urgency}</Text>
                    <TouchableOpacity
                      style={styles.claimButton}
                      activeOpacity={0.7}
                      onPress={() => handleClaimPress(donation)}
                    >
                      <Text style={styles.claimText}>Claim</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>

          {/* Enhanced Top Supporters Section - Vertical Layout */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Community Heroes</Text>
              <Text style={styles.sectionSubtitle}>Our most dedicated contributors</Text>
            </View>
          </View>

          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
            style={styles.supportersScrollVertical}
            contentContainerStyle={styles.supportersContainerVertical}
          >
            {topSupportersData.map((supporter, index) => (
              <View key={supporter.id} style={styles.supporterCardVertical}>
                <View style={styles.supporterHeader}>
                  <View style={styles.medalContainer}>
                    {index < 3 && (
                      <View style={[
                        styles.medal,
                        index === 0 && { backgroundColor: '#FFD700' },
                        index === 1 && { backgroundColor: '#C0C0C0' },
                        index === 2 && { backgroundColor: '#CD7F32' },
                      ]}>
                        <Ionicons name="medal" size={20} color="#fff" />
                      </View>
                    )}
                  </View>

                  <View style={styles.profileContainerVertical}>
                    <Image
                      source={{ uri: supporter.avatar }}
                      style={styles.profileImageVertical}
                    />
                    <View style={styles.verificationBadgeVertical}>
                      <Ionicons name="checkmark-circle" size={16} color="#2A9D8F" />
                    </View>
                  </View>

                  <View style={styles.supporterInfoVertical}>
                    <Text style={styles.supporterName}>{supporter.name}</Text>
                    <Text style={styles.supporterRole}>{supporter.role}</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${supporter.completion}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{supporter.completion}% of donation goal</Text>
                </View>

                <View style={styles.statsContainerVertical}>
                  <View style={styles.statItemVertical}>
                    <Ionicons name="heart" size={16} color="#E76F51" />
                    <Text style={styles.statLabel}>Donations</Text>
                    <Text style={styles.statValue}>{supporter.donations}</Text>
                  </View>

                  <View style={styles.statItemVertical}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.statLabel}>Rating</Text>
                    <Text style={styles.statValue}>{supporter.rating}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.messageButtonVertical}>
                  <Text style={styles.messageText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={{ height: 120 }} />
        </ScrollView>

        {!keyboardVisible && <NgoBottomNav />}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    fontSize: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  filterButton: {
    backgroundColor: '#2A9D8F',
    padding: 14,
    marginLeft: 10,
    borderRadius: 16,
    elevation: 4,
  },
 
  requestsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  requestCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },
  requestCount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  requestLabel: {
    color: '#fff',
    fontSize: 13,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#264653',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8D99AE',
    marginTop: 4,
  },
  sectionAction: {
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginVertical: 20,
    paddingLeft: 20,
  },
  promoBanner: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#fff',
  },
  promoImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  promoLabelContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 2,
  },
  promoLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  donationCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: width * 0.65,
    marginRight: 18,
    marginTop: 20,
    marginBottom: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  donationImage: {
    width: '100%',
    height: 120,
  },
  donationInfo: {
    padding: 14,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  donationDistance: {
    fontSize: 13,
    color: '#8D99AE',
    marginBottom: 10,
  },
  donationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgency: {
    color: '#E63946',
    fontWeight: '700',
    fontSize: 14,
  },
  claimButton: {
    backgroundColor: '#2A9D8F',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  claimText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  supportersScroll: {
    marginTop: 10,
  },
  supportersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  supporterCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  medalContainer: {
    position: 'absolute',
    top: -10,
    right: 10,
    zIndex: 2,
  },
  medal: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2A9D8F',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  supporterInfo: {
    alignItems: 'center',
  },
  supporterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2D42',
    marginBottom: 4,
  },
  supporterRole: {
    fontSize: 12,
    color: '#8D99AE',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ECECEC',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
  },
  progressText: {
    fontSize: 10,
    color: '#8D99AE',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2D42',
    marginLeft: 4,
  },
  supporterCardVertical: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    margingTop:20,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  
  messageButton: {
    backgroundColor: 'rgba(42,157,143,0.1)',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  messageText: {
    color: '#2A9D8F',
    fontSize: 12,
    fontWeight: '700',
  },
  supportersScrollVertical: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  supportersContainerVertical: {
    paddingBottom: 20,
    marginTop: 10,
  },
  supporterCardVertical: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  supporterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileContainerVertical: {
    position: 'relative',
    marginLeft: 10,
  },
  profileImageVertical: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2A9D8F',
  },
  verificationBadgeVertical: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },
  supporterInfoVertical: {
    flex: 1,
    marginLeft: 12,
  },
  statsContainerVertical: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  statItemVertical: {
    alignItems: 'center',
    flex: 1,
  },
 
  messageButtonVertical: {
    backgroundColor: 'rgba(76, 177, 165, 0.31)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  }
});