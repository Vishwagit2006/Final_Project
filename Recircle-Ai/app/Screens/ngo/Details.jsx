// In ProductDetailScreen.jsx - Modified to receive props
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Avatar,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import TopNavBar from '../../../components/TopNavBar';

const ProductDetailScreen = () => {
  <TopNavBar/>
  const params = useLocalSearchParams(); // Get route params safely

  // Parse donation data and give safe default values
  const donation = {
    id: params.id,
    title: params.title,
    quantity: params.quantity,
    distance: params.distance,
    urgency: params.urgency ,
    image: params.image 
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopNavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
        <Image
          source={{ uri: 'https://your-logo-url.com/logo.png' }}
          style={styles.logo}
        />
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View>

      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileContent}>
          <Avatar.Image
            size={50}
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          />
          <View style={{ marginLeft: 12 }}>
            <Text variant="titleMedium" style={styles.profileName}>Food Donor</Text>
            <Text style={styles.profileStatus}>Trusted & Consistent Supporter</Text>
            <View style={styles.starRow}>
              {Array(4).fill().map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#f4b400" />
              ))}
              <Ionicons name="star-outline" size={16} color="#f4b400" />
            </View>
          </View>
        </View>
      </Card>

      {/* Product Image */}
      <Card style={styles.productCard}>
        <Card.Cover
          source={{ uri: donation.image }}
          style={styles.productImage}
        />
      </Card>

      {/* Product Info */}
      <View style={styles.infoSection}>
        <Text style={styles.productTitle}>{donation.title}</Text>
        <Text style={styles.conditionText}>
          Status: <Text style={{ color: donation.urgency === 'Urgent' ? 'red' : 'green' }}>
            {donation.urgency}
          </Text>
        </Text>
        <View style={styles.deliveryRow}>
          <Text style={styles.detailText}>Distance: {donation.distance}</Text>
          <Text style={styles.detailText}>Quantity: {donation.quantity}</Text>
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.descriptionText}>
          Freshly prepared {donation.title} available for immediate pickup. <Text style={{ color: '#e57373' }}>Read more</Text>
        </Text>

        {/* Pickup Instructions */}
        <Text style={styles.sectionLabel}>Pickup Instructions</Text>
        <Text style={styles.descriptionText}>
          Available for pickup between 9AM-7PM. Please bring your own containers.
        </Text>
      </View>

      {/* Claim Button */}
      <Button
        mode="contained"
        onPress={() => router.push('/Screens/ngo/confirmClaim')}
        style={styles.claimButton}
        contentStyle={{ paddingVertical: 8 }}
        labelStyle={{ fontSize: 16 }}
      >
        Confirm Claim
      </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust for status bar
    marginBottom: 20,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileName: {
    fontWeight: 'bold',
  },
  profileStatus: {
    fontSize: 12,
    color: '#777',
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  productCard: {
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  productImage: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  conditionText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  deliveryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#777',
    marginRight: 15,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  claimButton: {
    marginHorizontal: 20,
    borderRadius: 8,
  },
});

export default ProductDetailScreen;