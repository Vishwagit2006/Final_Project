import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NgoBottomNav from '../../../components/NgoBottomNav';

export default function NGOProfileScreen() {
  const [ngoData, setNgoData] = useState({
    name: "Helping Hands Foundation",
    about: "Helping Hands redistributes surplus goods to communities in need, promoting sustainability and social equity.",
    donationsHandled: 1245,
    livesImpacted: 8700,
    location: "Mumbai, India",
    contactWebsite: "www.helpinghands.org",
    logoUrl: "https://www.w3schools.com/w3images/forest.jpg",
    socialScore: 92,
    badges: ["Top Contributor", "Sustainability Champion", "Community Leader"],
    recentCampaigns: [
      
      {
        title: "Clean India",
        description: "Organized 50+ clean-up drives across the city.",
        imageUrl: "https://www.w3schools.com/w3images/forest.jpg"
      },
      {
        title: "Clothes for All",
        description: "Donated 20,000+ clothes to homeless people.",
        imageUrl: "https://www.w3schools.com/w3images/lights.jpg"
      },
      {
        title: "Food for All",
        description: "Distributed 10,000+ meals to slum areas.",
        imageUrl: "https://images.pexels.com/photos/5915866/pexels-photo-5915866.jpeg"
      },
      {
        title: "Recycle to Empower",
        description: "Collected and recycled 5000+ clothing items.",
        imageUrl: "https://images.pexels.com/photos/1533725/pexels-photo-1533725.jpeg"
      }
      
    ],
    donationDetails: [
      { type: "Food", description: "We accept donations of non-perishable food items to support our community kitchens." },
      { type: "Clothing", description: "Donate gently used clothing to help those in need." },
      { type: "Money", description: "Monetary donations go directly to supporting our ongoing campaigns." },
      { type: "Furniture", description: "Donate used furniture to help families furnish their homes." }
    ]
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: ngoData.logoUrl }} style={styles.profileImage} />
          <Text style={styles.ngoName}>{ngoData.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.locationText}>{ngoData.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.sectionText}>{ngoData.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Can Donate</Text>
          {ngoData.donationDetails.map((item, index) => (
            <View key={index} style={styles.donationItem}>
              <Ionicons name="gift-outline" size={22} color="#4CAF50" />
              <View style={styles.donationInfo}>
                <Text style={styles.donationType}>{item.type}</Text>
                <Text style={styles.donationDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, styles.statsRow]}>
          <View style={styles.statBox}>
            <Ionicons name="gift-outline" size={22} color="#4CAF50" />
            <Text style={styles.statNumber}>{ngoData.donationsHandled}</Text>
            <Text style={styles.statLabel}>Donations</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={22} color="#4CAF50" />
            <Text style={styles.statNumber}>{ngoData.livesImpacted}</Text>
            <Text style={styles.statLabel}>Lives Touched</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Impact Score</Text>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${ngoData.socialScore}%` }]} />
          </View>
          <Text style={styles.scoreText}>{ngoData.socialScore}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges Earned</Text>
          <View style={styles.badgesContainer}>
            {ngoData.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Ionicons name="ribbon-outline" size={16} color="#fff" />
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Recent Campaigns</Text>
          <View style={styles.campaignsGrid}>
            {ngoData.recentCampaigns.map((campaign, index) => (
              <View key={index} style={styles.campaignCard}>
                <Image source={{ uri: campaign.imageUrl }} style={styles.campaignImage} />
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <Text style={styles.campaignDesc}>{campaign.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="globe-outline" size={20} color="#fff" />
          <Text style={styles.contactText}>Visit Website</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <NgoBottomNav />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#76C7C0",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height:240,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  ngoName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#555",
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: "#424242",
    lineHeight: 22,
  },
  donationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  donationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  donationType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#388E3C",
  },
  donationDesc: {
    fontSize: 14,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 13,
    color: "#757575",
  },
  progressBackground: {
    height: 18,
    backgroundColor: "#C8E6C9",
    borderRadius: 9,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#1B5E20",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    backgroundColor: "#66BB6A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 4,
  },
  campaignsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  campaignCard: {
    width: '48%',
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  campaignImage: {
    width: '100%',
    height: 100,
  },
  campaignTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#33691E",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  campaignDesc: {
    fontSize: 12,
    color: "#555",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#388E3C",
    marginHorizontal: 50,
    marginVertical: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});