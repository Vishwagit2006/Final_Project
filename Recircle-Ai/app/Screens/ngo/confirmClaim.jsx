//ngo->confirmClaim.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function NGOFoodDetailScreen() {
  const [isClaimed, setIsClaimed] = useState(false);
  const [donationData, setDonationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Simulate fetching donation data
  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setDonationData({
            id: params?.id || "1",
            title: "50 Food Packets",
            location: "Andheri, Mumbai",
            bestBefore: "24 April 2025",
            donor: "Green Restaurant",
            description: "Freshly prepared meals including rice, curry, and bread. Suitable for 50 people.",
            image: "https://via.placeholder.com/350x150",
            category: "Cooked Meals",
            quantity: "50 packets",
            status: isClaimed ? "claimed" : "available"
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching donation:", error);
        setLoading(false);
      }
    };

    fetchDonationData();
  }, [params?.id]);

  const handleClaimConfirmation = () => {
    Alert.alert(
      "Confirm Claim",
      "Are you sure you want to confirm this food claim?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        {
          text: "Yes, Confirm",
          onPress: () => {
            setIsClaimed(true);
            // Simulate API call to update claim status
            setTimeout(() => {
              Alert.alert(
                "Success!", 
                "Food claim confirmed successfully!",
                [
                  {
                    text: "Provide Feedback",
                    onPress: handleFeedback
                  },
                  {
                    text: "OK",
                    style: "default"
                  }
                ]
              );
            }, 500);
          }
        }
      ]
    );
  };

  const handleFeedback = () => {
    router.push({
      pathname: '/shared/ReviewSystem',
      params: { 
        sellerId: donationData?.donor || "Green Restaurant",
        product: donationData?.title,
        context: "food_donation"
      }
    });
  };

  const handleViewDonorProfile = () => {
    Alert.alert(
      "Donor Information",
      `Donor: ${donationData?.donor}\n\nWould you like to view their profile or provide feedback?`,
      [
        {
          text: "View Profile",
          onPress: () => router.push(`/Screens/Sentiment/SellerProfile${donationData?.donor}`)
        },
        {
          text: "Provide Feedback",
          onPress: handleFeedback
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="fast-food-outline" size={50} color="#2e7d32" />
        <Text style={styles.loadingText}>Loading donation details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Donation Image with overlay if claimed */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: donationData?.image }}
          style={[styles.donationImage, isClaimed && styles.claimedImage]}
        />
        {isClaimed && (
          <View style={styles.overlay}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#4caf50" />
            <Text style={styles.overlayText}>Claimed</Text>
          </View>
        )}
        <View style={styles.imageBadge}>
          <Text style={styles.badgeText}>{donationData?.category}</Text>
        </View>
      </View>

      {/* Donation Info */}
      <View style={styles.infoSection}>
        <Text style={[styles.title, isClaimed && styles.claimedTextGray]}>
          {donationData?.title}
        </Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={[styles.detail, isClaimed && styles.claimedTextGray]}>
            {donationData?.location}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={[styles.detail, isClaimed && styles.claimedTextGray]}>
            Best Before: {donationData?.bestBefore}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={18} color="#666" />
          <Text style={[styles.detail, isClaimed && styles.claimedTextGray]}>
            Donor: {donationData?.donor}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="information-circle-outline" size={18} color="#666" />
          <Text style={[styles.description, isClaimed && styles.claimedTextGray]}>
            {donationData?.description}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {!isClaimed ? (
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.claimButton} 
            onPress={handleClaimConfirmation}
          >
            <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Confirm Claim</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.donorButton}
            onPress={handleViewDonorProfile}
          >
            <Ionicons name="person-outline" size={18} color="#2e7d32" />
            <Text style={styles.donorButtonText}>View Donor Info</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.claimedSection}>
          <View style={styles.claimedBanner}>
            <Ionicons name="checkmark-circle" size={28} color="#4caf50" />
            <Text style={styles.claimedMessage}>Successfully Claimed!</Text>
          </View>
          
          <View style={styles.claimedActions}>
            <TouchableOpacity 
              style={styles.feedbackButton} 
              onPress={handleFeedback}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#2e7d32" />
              <Text style={styles.feedbackButtonText}>Provide Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/Screens/Individuals/Home')}
            >
              <Ionicons name="home-outline" size={18} color="#666" />
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  donationImage: {
    width: "100%",
    height: 200,
  },
  claimedImage: {
    opacity: 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    marginTop: 8,
    fontSize: 20,
    color: "#388e3c",
    fontWeight: "bold",
  },
  imageBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(46, 125, 50, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  detail: {
    fontSize: 16,
    color: "#555",
    flex: 1,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
    fontStyle: "italic",
  },
  claimedTextGray: {
    color: "#aaa",
  },
  actionSection: {
    gap: 12,
  },
  claimButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  donorButton: {
    backgroundColor: "#f1f8e9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  donorButtonText: {
    color: "#2e7d32",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  claimedSection: {
    gap: 16,
  },
  claimedBanner: {
    paddingVertical: 16,
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  claimedMessage: {
    color: "#388e3c",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  claimedActions: {
    gap: 10,
  },
  feedbackButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2e7d32",
    elevation: 2,
  },
  feedbackButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
});