import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Button, Card, Text, Title, Divider, IconButton } from "react-native-paper";
import { router } from 'expo-router';

// Placeholder image URLs
const memberProfileImages = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
];

const communityProfileImages = [
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/3.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
];

// Badge Icon
const VerifiedBadge = () => (
  <View style={styles.verifiedBadge}>
    <Text style={styles.verifiedText}>✔</Text>
  </View>
);

export default function CommunityDashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState("discussions");

  // Mock data for discussions and requests
  const discussions = [
    { id: 1, user: "Alice", content: "What are our plans for the next event?", image: memberProfileImages[0] },
    { id: 2, user: "Bob", content: "Can we donate unused laptops this week?", image: memberProfileImages[1] },
    { id: 3, user: "Charlie", content: "Looking for volunteers for our next workshop.", image: memberProfileImages[2] },
    { id: 4, user: "Diana", content: "How can we improve community outreach?", image: memberProfileImages[3] },
  ];

  const requests = [
    { id: 1, community: "Tech for All", content: "Looking for extra monitors for training sessions.", image: communityProfileImages[0], verified: true },
    { id: 2, community: "Green Initiatives", content: "Need volunteers for recycling drive this weekend.", image: communityProfileImages[1], verified: false },
    { id: 3, community: "Youth Empowerment", content: "Seeking donations for our after-school programs.", image: communityProfileImages[2], verified: true },
    { id: 4, community: "Clean Oceans", content: "Need more hands for our beach cleanup this Sunday.", image: communityProfileImages[3], verified: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.push("/shared/CommunityScreen")} // Go back to previous screen
          style={styles.backIcon}
        />
        <Title style={styles.headerTitle}>Community Dashboard</Title>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === "discussions" ? "contained" : "outlined"}
          onPress={() => setActiveTab("discussions")}
          style={[styles.tabButton, activeTab === "discussions" ? styles.activeButton : styles.inactiveButton]}
          labelStyle={styles.tabLabel}
        >
          Discussions
        </Button>
        <Button
          mode={activeTab === "requests" ? "contained" : "outlined"}
          onPress={() => setActiveTab("requests")}
          style={[styles.tabButton, activeTab === "requests" ? styles.activeButton : styles.inactiveButton]}
          labelStyle={styles.tabLabel}
        >
          Requests
        </Button>
      </View>

      <Divider style={styles.divider} />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "discussions" && (
          <View>
            <Title style={styles.sectionTitle}>Community Discussions</Title>
            {discussions.map((discussion) => (
              <Card key={discussion.id} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.profileContainer}>
                      <Image source={{ uri: discussion.image }} style={styles.profileImage} />
                      <Text style={styles.cardTitle}>{discussion.user}</Text>
                    </View>
                    <IconButton icon="account" size={20} style={styles.cardIcon} />
                  </View>
                  <Text style={styles.cardContent}>{discussion.content}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {activeTab === "requests" && (
          <View>
            <Title style={styles.sectionTitle}>Requests from Communities</Title>
            {requests.map((request) => (
              <Card key={request.id} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.profileContainer}>
                      <Image source={{ uri: request.image }} style={styles.profileImage} />
                      <Text style={styles.cardTitle}>{request.community}</Text>
                      {/* Display verified badge if the community is verified */}
                      {request.verified && <VerifiedBadge />}
                    </View>
                    <IconButton icon="earth" size={20} style={styles.cardIcon} />
                  </View>
                  <Text style={styles.cardContent}>{request.content}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  backIcon: {
    padding: 0,
    marginRight: 16,
    backgroundColor: "#E3F2FD",
    borderRadius: 50,
    right:15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A9D8F", // Green color for header
    textAlign: "center",
    right:20,

    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  activeButton: {
    backgroundColor: "#2A9D8F", // Green for active state
  },
  inactiveButton: {
    backgroundColor: "#ffffff", // White for inactive state
    borderColor: "#388E3C", // Green border for inactive button
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "black", // White text for the active button
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#ddd",
  },
  content: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  card: {
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  cardIcon: {
    margin: 0,
    backgroundColor: "#E3F2FD",
  },
  cardContent: {
    fontSize: 14,
    color: "#6B7280",
  },
  // Verified Badge styles
  verifiedBadge: {
    backgroundColor: "#4CAF50", // Green for verified
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
