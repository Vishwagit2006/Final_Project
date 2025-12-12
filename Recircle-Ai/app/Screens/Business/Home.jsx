// File: app/Business/home.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TopNavBar from '../../../components/TopNavBar';
import BottomNav from '../../../components/BottomNav';
import BussinessBottomNav from '../../../components/BussinessBottomNav';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2A9D8F',
  secondary: '#264653',
  accent: '#E76F51',
  background: '#F8F9FA',
  text: '#2B2D42',
  muted: '#8D99AE',
};

const categories = [
  { icon: 'tshirt', label: 'Clothes', route: '/donate/clothes' },
  { icon: 'shoe-prints', label: 'Shoes', route: '/donate/shoes' },
  { icon: 'tablet-alt', label: 'Electronics', route: '/donate/electronics' },
  { icon: 'book', label: 'Books', route: '/donate/books' },
  { icon: 'baby', label: 'Toys', route: '/donate/toys' },
  { icon: 'couch', label: 'Furniture', route: '/donate/furniture' },
];

const ngos = [
  { name: 'Helping Hands', location: 'Near PSNA College, Dindigul', rating: 4.5 },
  { name: 'Care Givers', location: 'Opposite Main Market, Dindigul', rating: 4.2 },
  { name: 'Hope Foundation', location: 'Park Road, Madurai', rating: 4.8 },
  { name: 'Green Earth', location: 'Anna Nagar, Madurai', rating: 4.6 },
  { name: 'Future Bright', location: 'Near Old Bus Stand, Dindigul', rating: 4.4 },

];

export default function HomeScreen() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredNgos, setFilteredNgos] = useState(ngos);
  const router = useRouter();

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = ngos.filter((ngo) =>
      ngo.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredNgos(filtered);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <TopNavBar />
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <TextInput
              placeholder="Search NGO"
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearch}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Promo Banner */}
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoLabel}>Special Offer</Text>
              <Text style={styles.promoText}>Get premium features when you donate 5+ items</Text>
            </View>
            <Image 
              source={require('../../../assets/images/headphone.png')} 
              style={styles.promoImage} 
            />
          </View>

          {/* Categories Section */}
          <Text style={styles.sectionTitle}>Donation Categories</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.categoryCard}
                onPress={() => router.push(cat.route)}
              >
                <View style={styles.categoryIconContainer}>
                  <FontAwesome5 
                    name={cat.icon} 
                    size={20} 
                    color="#fff" 
                  />
                </View>
                <Text style={styles.categoryTitle}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nearby NGOs Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby NGOs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {filteredNgos.length > 0 ? (
            filteredNgos.map((ngo, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.ngoCard}
                activeOpacity={0.9}
              >
                <View style={styles.ngoInfo}>
                  <View style={styles.ngoIcon}>
                    <FontAwesome5 name="hand-holding-heart" size={20} color="#fff" />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.ngoName}>{ngo.name}</Text>
                    <Text style={styles.ngoLocation}>{ngo.location}</Text>
                  </View>
                </View>
                <View style={styles.rating}>
                  <FontAwesome5 name="star" size={12} color="gold" />
                  <Text style={styles.ratingText}>{ngo.rating}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResults}>No NGOs found</Text>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <BussinessBottomNav/>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    marginLeft: 12,
    elevation: 3,
  },
  promoBanner: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    height: 170,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    marginRight: 16,
  },
  promoLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  promoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  promoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: '28%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  categoryIconContainer: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  ngoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ngoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoIcon: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
  },
  ngoName: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  ngoLocation: {
    color: COLORS.muted,
    fontSize: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42,157,143,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    color: COLORS.primary,
  },
  noResults: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 16,
    marginTop: 16,
  },
});