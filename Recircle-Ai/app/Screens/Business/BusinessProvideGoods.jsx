import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, Title, Badge, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const BusinessProvideGoods = () => {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('donations');

  // Mock data for initial load
  const mockBusinessDonations = [
    {
      id: 'donation1',
      title: 'Medical Equipment Donation',
      imageUrl: 'https://via.placeholder.com/300?text=Medical+Equipment',
      urgency: 'high',
      locationName: 'Mumbai, Maharashtra',
      listingType: 'ngo-donation',
      bulkQuantity: 50,
      timestamp: '2024-02-15T08:00:00Z'
    },
    {
      id: 'donation2',
      title: 'School Supplies for NGOs',
      imageUrl: 'https://via.placeholder.com/300?text=School+Supplies',
      urgency: 'medium',
      locationName: 'Bangalore, Karnataka',
      listingType: 'ngo-donation',
      bulkQuantity: 200,
      timestamp: '2024-02-14T10:30:00Z'
    }
  ];

  const mockBusinessListings = [
    {
      id: 'listing1',
      title: 'Textile Overstock - Cotton',
      imageUrl: 'https://via.placeholder.com/300?text=Cotton+Fabric',
      pricePerUnit: 120,
      bulkQuantity: 1000,
      listingType: 'wholesale',
      locationName: 'Surat, Gujarat',
      timestamp: '2024-02-15T09:15:00Z'
    },
    {
      id: 'listing2',
      title: 'Steel Rods Construction Grade',
      imageUrl: 'https://via.placeholder.com/300?text=Steel+Rods',
      pricePerUnit: 85,
      bulkQuantity: 5000,
      listingType: 'wholesale',
      locationName: 'Hyderabad, Telangana',
      timestamp: '2024-02-13T14:45:00Z'
    }
  ];

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('[DEBUG] Initializing data...');
        // Check if data exists in AsyncStorage
        const [donationData, listingData] = await Promise.all([
          AsyncStorage.getItem('business-donations'),
          AsyncStorage.getItem('business-listings'),
        ]);

        if (!donationData) {
          console.log('[DEBUG] No donation data found, setting mock data...');
          await AsyncStorage.setItem('business-donations', JSON.stringify(mockBusinessDonations));
        }

        if (!listingData) {
          console.log('[DEBUG] No listing data found, setting mock data...');
          await AsyncStorage.setItem('business-listings', JSON.stringify(mockBusinessListings));
        }

        loadListings();
      } catch (error) {
        console.error('[ERROR] Failed to initialize data:', error);
        Alert.alert('Error', 'Failed to initialize data');
      }
    };

    const loadListings = async () => {
      try {
        console.log('[DEBUG] Loading listings...');
        const [donationData, listingData] = await Promise.all([
          AsyncStorage.getItem('business-donations'),
          AsyncStorage.getItem('business-listings'),
        ]);
        
        setDonations(donationData ? JSON.parse(donationData) : []);
        setListings(listingData ? JSON.parse(listingData) : []);
        console.log('[DEBUG] Donations loaded:', donationData);
        console.log('[DEBUG] Listings loaded:', listingData);
      } catch (error) {
        console.error('[ERROR] Failed to load listings:', error);
        Alert.alert('Error', 'Failed to load business listings');
      }
    };

    initializeData();
  }, []);

  const handleAddProduct = () => {
    console.log('[DEBUG] Navigating to Add Product Screen...');
    router.push('/Screens/Business/ProvideGoods');
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover 
      source={{ uri: item.imageUrl }} 
      style={styles.image}
      resizeMode="cover"
    />
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        
        {item.listingType === 'ngo-donation' ? (
          <>
            <View style={styles.infoRow}>
              <MaterialIcons name="warning" size={16} color="#FF6B6B" />
              <Text style={styles.urgency}>{item.urgency} urgency</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={16} color="#4CAF50" />
              <Text style={styles.location}>{item.locationName}</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.price}>₹{item.pricePerUnit}/unit</Text>
            <Text style={styles.quantity}>{item.bulkQuantity} units available</Text>
          </>
        )}
        
        <Button 
          mode="contained" 
          style={styles.button}
          onPress={() => {
            console.log('[DEBUG] Viewing details for:', item.id);
            // In BusinessProvideGoods renderItem function:
            router.push({
        pathname: '/Screens/Business/BusinessListingDetails',
        params: { 
        listingId: item.id,
        listingType: item.listingType 
    }
  });
          }}
        >
          View Details
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => {
            console.log('[DEBUG] Navigating back...');
            router.back();
          }}
        />
        <Text style={styles.headerTitle}>Business Listings</Text>
      </View>

      <View style={styles.tabs}>
        <Button 
          mode={activeTab === 'donations' ? 'contained' : 'outlined'} 
          style={styles.tabButton}
          onPress={() => {
            console.log('[DEBUG] Switching to Donations tab...');
            setActiveTab('donations');
          }}
        >
          Donations ({donations.length})
        </Button>
        <Button 
          mode={activeTab === 'listings' ? 'contained' : 'outlined'} 
          style={styles.tabButton}
          onPress={() => {
            console.log('[DEBUG] Switching to Listings tab...');
            setActiveTab('listings');
          }}
        >
          Bulk Listings ({listings.length})
        </Button>
      </View>

      <FlatList
        data={activeTab === 'donations' ? donations : listings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {activeTab === 'donations' ? 'donations' : 'listings'} found</Text>
          </View>
        }
      />

      <Button
        mode="contained"
        style={styles.addButton}
        labelStyle={styles.addButtonLabel}
        onPress={handleAddProduct}
      >
        Add New Product
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  image: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0' // Add fallback background
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#B34523',
  },
  card: {
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  image: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  urgency: {
    color: '#FF6B6B',
    marginLeft: 8,
  },
  location: {
    color: '#4CAF50',
    marginLeft: 8,
  },
  price: {
    fontSize: 16,
    color: '#B34523',
    fontWeight: 'bold',
  },
  quantity: {
    color: '#666',
    marginVertical: 8,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#B34523',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 8,
    borderColor: '#B34523',
  },
  list: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#B34523',
    borderRadius: 8,
    elevation: 4,
  },
  addButtonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BusinessProvideGoods;