// File: app/individual/Profies.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../../../components/BottomNav";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  // Sample data for missions and achievements
  const missions = [
    { id: 1, title: "Donate 5 Items", progress: 3, target: 5, unit: "items", deadline: "2024-03-31", reward: "300 Points" },
    { id: 2, title: "Sell 3 Products", progress: 1, target: 3, unit: "products", deadline: "2024-02-28", reward: "500 Points" },
    { id: 3, title: "Eco Warrior Week", progress: 4, target: 7, unit: "days", deadline: "2024-04-15", reward: "Eco Badge" },
  ];

  const achievements = [
    { id: 1, title: "First Donation", icon: "gift", earned: true, description: "Make your first item donation" },
    { id: 2, title: "Power Seller", icon: "star", earned: false, description: "Sell 10+ products" },
    { id: 3, title: "Eco Champion", icon: "leaf", earned: true, description: "Donate 20+ items" },
    { id: 4, title: "Community Hero", icon: "account-heart", earned: true, description: "Help 5+ community members" },
    { id: 5, title: "Quick Seller", icon: "rocket", earned: false, description: "Sell item within 24 hours" },
    { id: 6, title: "Top Rater", icon: "thumb-up", earned: true, description: "Receive 10+ positive ratings" },
  ];

  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalAchievements = achievements.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContent}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={18} color="#2F4858" />
              </TouchableOpacity>
            </View>
            <Text style={styles.username}>Rahul Mehra</Text>
            <Text style={styles.userSubtitle}>Eco Saver | Product Distributor</Text>

            <View style={styles.verificationBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.verificationText}>Verified Member</Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {renderStat("32", "Items Donated", "leaf")}
              {renderStat("18", "Products Sold", "cart")}
              {renderStat("5", "Active Listings", "pricetag")}
            </View>
          </View>

          {/* Progress Section */}
          <TouchableOpacity onPress={() => router.push('/shared/Gamification')}>
            <View style={styles.progressSection}>
              {renderProgress("850", "Eco Points", "ribbon")}
              {renderProgress("#512", "Global Rank", "earth")}
              {renderProgress("#23", "City Rank", "location")}
            </View>
          </TouchableOpacity>

          {/* Listings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Listings</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { title: 'Chairs', image: require('../../../assets/images/chair.png') },
                { title: 'Veggies', image: require('../../../assets/images/veggies.png') },
                { title: 'Laptop', image: require('../../../assets/images/laptop.png') },
              ].map((item, index) => (
                <ListingCard key={index} title={item.title} image={item.image} />
              ))}
            </ScrollView>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/Screens/Individuals/ProvideGoods')}
          >
            <Ionicons name="add-circle" size={22} color="white" />
            <Text style={styles.primaryButtonText}>Create New Listing</Text>
          </TouchableOpacity>

          {/* Challenges Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Challenges</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>
            <ChallengeCard
              title="Donate 5 Items"
              points="300 Points"
              progress={0.6}
              daysLeft={3}
            />
            <ChallengeCard
              title="Sell 3 Products"
              points="500 Points"
              progress={0.3}
              daysLeft={5}
            />
          </View>

          {/* NEW: Missions Section - Placed after existing cards */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.gamificationTitleContainer}>
                <MaterialCommunityIcons name="flag-checkered" size={20} color="#76C7C0" />
                <Text style={styles.sectionTitle}>Active Missions</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMissionsModal(true)}>
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {missions.slice(0, 2).map((mission) => (
              <SimpleMissionItem 
                key={mission.id}
                mission={mission}
              />
            ))}
          </View>

          {/* NEW: Achievements Section - Placed after missions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.gamificationTitleContainer}>
                <MaterialCommunityIcons name="trophy" size={20} color="#76C7C0" />
                <Text style={styles.sectionTitle}>Achievements</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAchievementsModal(true)}>
                <Text style={styles.sectionAction}>
                  {earnedAchievements}/{totalAchievements}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.achievementsPreview}>
              {achievements.slice(0, 4).map((achievement) => (
                <SimpleAchievementBadge 
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </View>
          </View>

        </ScrollView>
      </View>

      {/* Missions Modal */}
      <Modal
        visible={showMissionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMissionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Active Missions</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowMissionsModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {missions.map((mission) => (
              <SimpleMissionItem 
                key={mission.id}
                mission={mission}
                fullWidth={true}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Achievements Modal */}
      <Modal
        visible={showAchievementsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAchievementsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Achievements ({earnedAchievements}/{totalAchievements})
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAchievementsModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <SimpleAchievementBadge 
                  key={achievement.id}
                  achievement={achievement}
                  fullSize={true}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

// SIMPLIFIED Mission Item Component
const SimpleMissionItem = ({ mission, fullWidth = false }) => {
  const progressPercent = Math.round((mission.progress / mission.target) * 100);
  
  return (
    <View style={[
      styles.simpleMissionItem,
      fullWidth && styles.fullWidthMission
    ]}>
      <View style={styles.simpleMissionHeader}>
        <Text style={styles.simpleMissionTitle}>{mission.title}</Text>
        <Text style={styles.simpleMissionProgress}>{progressPercent}%</Text>
      </View>
      
      <View style={styles.simpleMissionProgressBar}>
        <View 
          style={[
            styles.simpleMissionProgressFill, 
            { width: `${progressPercent}%` }
          ]} 
        />
      </View>
      
      <View style={styles.simpleMissionFooter}>
        <Text style={styles.simpleMissionStats}>
          {mission.progress}/{mission.target} {mission.unit}
        </Text>
        <Text style={styles.simpleMissionReward}>{mission.reward}</Text>
      </View>
    </View>
  );
};

// SIMPLIFIED Achievement Badge Component
const SimpleAchievementBadge = ({ achievement, fullSize = false }) => (
  <View style={[
    styles.simpleAchievementItem,
    achievement.earned ? styles.achievementEarned : styles.achievementLocked,
    fullSize && styles.fullSizeAchievement
  ]}>
    <MaterialCommunityIcons 
      name={achievement.icon} 
      size={fullSize ? 32 : 24} 
      color={achievement.earned ? '#4CAF50' : '#CCCCCC'} 
    />
    <Text style={[
      styles.simpleAchievementTitle,
      achievement.earned ? styles.achievementTitleEarned : styles.achievementTitleLocked
    ]}>
      {achievement.title}
    </Text>
    {achievement.earned && (
      <MaterialCommunityIcons 
        name="check-circle" 
        size={16} 
        color="#4CAF50" 
        style={styles.achievementCheck} 
      />
    )}
    {fullSize && (
      <Text style={styles.achievementDescription}>
        {achievement.description}
      </Text>
    )}
  </View>
);

// Reusable Components (keep existing ones)
function renderStat(value, label, iconName) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statIconContainer}>
        <Ionicons name={iconName} size={20} color="#4CAF50" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function renderProgress(value, label, iconName) {
  return (
    <View style={styles.progressItem}>
      <View style={styles.progressIcon}>
        <Ionicons name={iconName} size={18} color="#2F4858" />
      </View>
      <Text style={styles.progressValue}>{value}</Text>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
}

function ListingCard({ title, image }) {
  return (
    <View style={styles.listingCard}>
      <View style={styles.listingImage}>
        <Image source={image} style={styles.listingImageStyle} />
      </View>
      <Text style={styles.listingTitle}>{title}</Text>
      <Text style={styles.listingStatus}>Active</Text>
    </View>
  );
}

function ChallengeCard({ title, points, progress, daysLeft }) {
  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Ionicons name="trophy" size={18} color="#FFC107" />
        <Text style={styles.challengeTitle}>{title}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.challengeFooter}>
        <Text style={styles.challengePoints}>{points}</Text>
        <Text style={styles.challengeDays}>{daysLeft} days left</Text>
      </View>
    </View>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  mainContent: {
    flex: 1,
    paddingBottom: 60,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 36,
    backgroundColor: '#e0f7fa',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 18,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#D1E8E2',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#D1E8E2',
    padding: 7,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  userSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 10,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  verificationText: {
    fontSize: 12,
    color: '#16A34A',
    marginLeft: 6,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 20,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  
  // Section Styles (for both existing and new sections)
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionAction: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Gamification Title Container
  gamificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Simple Mission Styles
  simpleMissionItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  fullWidthMission: {
    marginHorizontal: 0,
  },
  simpleMissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simpleMissionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  simpleMissionProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#76C7C0',
  },
  simpleMissionProgressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  simpleMissionProgressFill: {
    height: '100%',
    backgroundColor: '#76C7C0',
    borderRadius: 3,
  },
  simpleMissionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simpleMissionStats: {
    fontSize: 12,
    color: '#666',
  },
  simpleMissionReward: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '500',
  },
  
  // Achievements Styles
  achievementsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  simpleAchievementItem: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    position: 'relative',
  },
  fullSizeAchievement: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  achievementEarned: {
    backgroundColor: '#f0f9f0',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  achievementLocked: {
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 3,
    borderLeftColor: '#CCCCCC',
  },
  simpleAchievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  achievementTitleEarned: {
    color: '#333',
  },
  achievementTitleLocked: {
    color: '#999',
  },
  achievementCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  achievementDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  
  // Existing Listing and Challenge Styles
  listingCard: {
    width: 150,
    marginRight: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
  },
  listingImage: {
    height: 100,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  listingImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  listingStatus: {
    fontSize: 13,
    color: '#16A34A',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#76C7C0',
    padding: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
  challengeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0F2FE',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengePoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  challengeDays: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});