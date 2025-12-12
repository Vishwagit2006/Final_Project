//provideGood
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, Title, Badge, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProvideGoods = () => {
  const router = useRouter();
  const [donatedItems, setDonatedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const defaultDonations = [
    {
      id: '1',
      title: 'Winter Coat',
      category: 'clothing',
      imageUri: 'https://via.placeholder.com/150',
      condition: 'used',
      donationVisibility: 'public',
      logistics: 'pickup',
      contactPreference: 'chat',
      status: 'not claimed',
      timestamp: '2023-10-01T12:00:00Z',
    },
    {
      id: '2',
      title: 'Office Chair',
      category: 'furniture',
      imageUri: 'https://via.placeholder.com/150',
      condition: 'new',
      donationVisibility: 'private',
      recipientName: 'Local Charity',
      logistics: 'dropoff',
      contactPreference: 'email',
      status: 'claimed',
      timestamp: '2023-10-02T14:30:00Z',
    },
  ];

  const defaultSales = [
    {
      id: '3',
      title: 'Designer Handbag',
      category: 'clothing',
      imageUri: 'https://via.placeholder.com/150',
      condition: 'new',
      price: '299.00',
      quantity: '1',
      location: 'New York',
      contactPreference: 'chat',
      status: 'not claimed',
      timestamp: '2023-10-03T09:15:00Z',
    },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [donatedData, soldData] = await Promise.all([
          AsyncStorage.getItem('donation-products'),
          AsyncStorage.getItem('selling-products'),
        ]);

        const storedDonations = donatedData ? JSON.parse(donatedData) : [];
        const storedSales = soldData ? JSON.parse(soldData) : [];

        // Deduplicate by id
        const donatedIds = new Set(storedDonations.map(item => item.id));
        const uniqueDefaultDonations = defaultDonations.filter(item => !donatedIds.has(item.id));
        const donated = [...storedDonations, ...uniqueDefaultDonations];

        const soldIds = new Set(storedSales.map(item => item.id));
        const uniqueDefaultSales = defaultSales.filter(item => !soldIds.has(item.id));
        const sold = [...storedSales, ...uniqueDefaultSales];

        setDonatedItems(donated);
        setSoldItems(sold);
      } catch (error) {
        Alert.alert('Error', 'Failed to load products. Please try again.');
        setDonatedItems(defaultDonations);
        setSoldItems(defaultSales);
      }
    };

    loadProducts();
  }, []);

  const truncateTitle = (title, maxLength = 20) => {
    if (!title) return 'Unnamed Item';
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const renderItem = ({ item, isDonated }) => (
    <Card style={styles.card} key={item.id}>
      <Card.Cover
        source={{ uri: item.imageUri || 'https://via.placeholder.com/150' }}
        style={styles.cardImage}
      />
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Title style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
            {truncateTitle(item.title)}
          </Title>
          <Badge
            style={[
              styles.statusBadge,
              item.status === 'claimed' ? styles.claimed : styles.notClaimed,
            ]}
          >
            {item.status || 'not claimed'}
          </Badge>
        </View>
        <View style={styles.tagContainer}>
          <Badge style={styles.categoryBadge}>{item.category || 'N/A'}</Badge>
        </View>
        {!isDonated && (
          <Text style={styles.itemPrice}>
            ₹{(item.price && Number(item.price).toFixed(2)) || '0.00'}
          </Text>
        )}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push({
              pathname: '/Screens/Individuals/ProductDetails',
              params: { productId: item.id, itemType: isDonated ? 'donation' : 'sale' },
            })
          }
        >
          <Text style={styles.detailsButtonText}>More Details</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = (isDonated) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {isDonated ? 'No donated items yet.' : 'No items for sale yet.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="#000000"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Provide Goods</Text>
      </View>

      <Text style={styles.sectionTitle}>Donated Products</Text>
      <FlatList
        data={donatedItems}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => renderItem({ item, isDonated: true })}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={() => renderEmptyState(true)}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionTitle}>Sold Goods</Text>
      <FlatList
        data={soldItems}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => renderItem({ item, isDonated: false })}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={() => renderEmptyState(false)}
        contentContainerStyle={styles.listContainer}
      />

      <Button
        mode="contained"
        style={styles.addButton}
        labelStyle={styles.addButtonLabel}
        onPress={() => router.push('/Screens/Individuals/AddProductScreen')}
      >
        Add New Item
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B34523',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B34523',
    marginVertical: 12,
    paddingLeft: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: '48%', // Ensures consistent width for both cards in a row
  },
  cardContent: {
    padding: 12,
  },
  cardImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    borderRadius: 10,
    fontSize: 10,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  claimed: {
    backgroundColor: '#4CAF50',
  },
  notClaimed: {
    backgroundColor: '#FF5722',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#31DABD',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 6,
    marginRight: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B34523',
    marginBottom: 8,
  },
  detailsButton: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#B34523',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 8,
    backgroundColor: '#B34523',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default ProvideGoods;