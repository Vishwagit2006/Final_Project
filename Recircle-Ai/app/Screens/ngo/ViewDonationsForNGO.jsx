import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Title, Badge, IconButton, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 6;
const CARD_WIDTH = (width - 16 * 2 - CARD_MARGIN * 2) / 2;

const sampleDonations = [
  {
    id: '1',
    title: 'Rice Bags',
    category: 'Food',
    status: 'not claimed',
    imageUri: 'https://images.unsplash.com/photo-1604908177522-402a8a318ba3',
  },
  {
    id: '2',
    title: 'Winter Jackets',
    category: 'Clothing',
    status: 'claimed',
    imageUri: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  },
  {
    id: '3',
    title: 'Books for Kids',
    category: 'Education',
    status: 'not claimed',
    imageUri: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
  },
  {
    id: '4',
    title: 'Leftover Food Packets',
    category: 'Food',
    status: 'claimed',
    imageUri: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf4e',
  },
  {
    id: '5',
    title: 'School Uniforms',
    category: 'Clothing',
    status: 'not claimed',
    imageUri: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7',
  },
];

const ViewDonationsForNGO = () => {
  const router = useRouter();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [pastDonations, setPastDonations] = useState([]);

  useEffect(() => {
    const available = sampleDonations.filter(item => item.status === 'not claimed');
    const past = sampleDonations.filter(item => item.status === 'claimed');
    setAvailableDonations(available);
    setPastDonations(past);
  }, []);

  const truncateTitle = (title, maxLength = 20) =>
    title.length > maxLength ? title.substring(0, maxLength) + '...' : title;

  const renderItem = ({ item }) => (
    <Card style={styles.card} key={item.id}>
      <Card.Cover source={{ uri: item.imageUri }} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Title style={styles.itemTitle}>{truncateTitle(item.title)}</Title>
              <Badge style={[styles.statusBadge, item.status === 'claimed' ? styles.claimed : styles.notClaimed]}>
                {item.status}
              </Badge>
            </View>
            <Badge style={styles.categoryBadge}>{item.category}</Badge>
          </View>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push({
              pathname: '/Screens/NGO/ProductDetails',
              params: { productId: item.id },
            })
          }
        >
          <Text style={styles.detailsButtonText}>More Details</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderEmpty = msg => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{msg}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>View Donations</Text>
      </View>

      <Text style={styles.sectionTitle}>Available Donations</Text>
      <FlatList
        data={availableDonations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={renderEmpty('No available donations.')}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Text style={styles.sectionTitle}>Past Donations</Text>
      <FlatList
        data={pastDonations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={renderEmpty('No past donations.')}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <FAB
        icon="magnify"
        style={styles.fab}
        onPress={() => router.push('/Screens/ngo/DataCollection')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 12,
  },
  cardImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
    maxWidth: '80%',
  },
  statusBadge: {
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 0,
    color: '#fff',
    alignSelf: 'flex-start',
  },
  claimed: {
    backgroundColor: '#4CAF50',
  },
  notClaimed: {
    backgroundColor: '#FF5722',
  },
  categoryBadge: {
    backgroundColor: '#31DABD',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  detailsButton: {
    backgroundColor: '#B34523',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#B34523',
  },
});

export default ViewDonationsForNGO;