import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import TopNavBar from '../../../components/TopNavBar';
import BottomNav from "../../../components/BottomNav";

const { width: screenWidth } = Dimensions.get('window');

// Editable Data Section
const promoBanners = [
  require('../../../assets/images/home_promo.jpg'), // Update path as needed
  require("../../../assets/images/promo2.png"),
];

const categories = [
  { name: "Fashion", icon: "shirt-outline", route: "/Screens/Individuals/Category" },
  { name: "Furnitures", icon: "bed-outline", route: "/Screens/Individuals/Category" },
  { name: 'Toys', icon: "game-controller-outline", route: "/Screens/Individuals/Category" },
  { name: "Books", icon: "book-outline", route: "/Screens/Individuals/Category" },
  { name: "Electronics", icon: "hardware-chip-outline", route: "/Screens/Individuals/Category" },
];

const products = [
  {
    name: "Smart Watch",
    price: "499",
    rating: "4.5",
    description2: "Upgrade your lifestyle with this stylish and powerful smartwatch. Track your fitness, monitor your heart rate, receive call and message notifications, and enjoy long-lasting battery life—all from your wrist.",
    image: { uri: "https://5.imimg.com/data5/SELLER/Default/2023/1/EW/BS/ID/99197044/men-smart-watch.png" },
    detailsRoute: '/product/smart-watch',
  },
  {
    name: "Headphones",
    price: "299",
    rating: "4.5",
    description2: " lightweight, over-ear wireless headphones are perfect for music lovers, gamers, and on-the-go professionals. Enjoy seamless Bluetooth connectivity and all-day comfort with a long-lasting battery.",
    image: { uri: "https://www.boat-lifestyle.com/cdn/shop/products/main2_b66dce6b-710d-49cb-9d1c-2bc8c9c0ab15.png?v=1645698328" },
    detailsRoute: '/product/headphones',
  },
  {
    name: "Sneakers",
    price: "599",
    rating: "4.5",
    description2: " Whether you're hitting the streets or heading to the gym, these sneakers offer the perfect blend of style, support, and breathability.",
    image: { uri: "https://redtape.com/cdn/shop/products/8-800x800_22c88bd9-f9c2-4c61-ab55-71edce92bf57.jpg?v=1741350727" },
    detailsRoute: '/product/sneakers',
  },
  {
    name: "Backpack",
    price: "399",
    rating: "4.5",
    description2: "Ideal for students, travelers, and professionals, it features spacious compartments, padded laptop sleeves, and ergonomic straps for all-day comfort.",
    image: { uri: "https://safaribags.com/cdn/shop/files/3_4bde5165-92cd-4305-b571-dea21fe6568e.jpg?v=1707731843" },
    detailsRoute: '/product/backpack',
  },
  {
    name: "Laptops",
    price: "24999",
    rating: "4.5",
    description2: "Boost your productivity and entertainment with our latest range of high-performance laptops. Sleek design, lightning-fast processors, and long-lasting battery life—perfect for students, professionals, and gamers alike.",
    image: { uri: "https://i.gadgets360cdn.com/large/Honor_magicbook_15_india_1596185743762.jpg" },
    detailsRoute: '/product/laptops',
  },
];

const Home = () => {
  const router = useRouter();
  const scrollViewRef = useRef();
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (promoBanners.length > 1) {
      const timer = setInterval(() => {
        const nextIndex = (currentPromoIndex + 1) % promoBanners.length;
        setCurrentPromoIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth - 32, // Adjust for horizontal margins
          animated: true,
        });
      }, 100000);

      return () => clearInterval(timer);
    }
  }, [currentPromoIndex, promoBanners.length]);

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "/Screens/Individuals/Category",
      params: {
        params: { selectedCategory: category.name }, // Pass the category name for filtering
      },
    });
  };

  const handleProductPress = (product) => {
    router.push({
      pathname: "/Screens/Individuals/pro_details",
      params: {
        image: product.image.uri,
        product: product.name,
        category: product.category, 
        rating: product.rating,
        price: product.price,
        description2: product.description2,
      },
    });
  };

  const handleSeeAllCategories = () => {
    router.push('/Screens/Individuals/Category');
  };

  const handleSeeAllProducts = () => {
    router.push('/Screens/Individuals/Products');
  };

  const handleExplore = () => {
    router.push('/explore');
  };

  const handlePromoPress = (index) => {
    console.log(`Promo banner ${index + 1} pressed`);
    router.push('/promo-details');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopNavBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Hello, User 👋</Text>
          <Text style={styles.greetingSubtitle}>What are you looking for today?</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.promoSection}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.promoScrollView}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentPromoIndex(newIndex);
            }}
          >
            {promoBanners.map((banner, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.bannerContainer, { width: screenWidth - 32 }]}
                onPress={() => handlePromoPress(index)}
              >
                <Image
                  source={banner}
                  style={styles.promoBanner}
                  resizeMode="cover"
                />
                {index === 0 && (
                  <View style={styles.promoTitleOverlay}>
                    <Text style={styles.promoTitleText}>Promo</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {promoBanners.length > 1 && (
            <View style={styles.pagination}>
              {promoBanners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentPromoIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={handleSeeAllCategories}>
            <Ionicons name="chevron-forward-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category)} // Use category.route here
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={category.icon} size={30} color="#007BFF" />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <TouchableOpacity onPress={handleSeeAllProducts}>
            <Ionicons name="chevron-forward-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {products.map((product, index) => (
            <TouchableOpacity
            key={index}
            style={styles.productCard}
            onPress={() => handleProductPress(product)}
          >
              <Card>
                <View style={styles.cardContent}>
                  <Image source={product.image} style={styles.productImage} resizeMode="cover" />

                  {product.rating && (
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={10} color="#fff" />
                      <Text style={styles.ratingText}>{product.rating}</Text>
                    </View>
                  )}

                  <Text style={styles.productName}>{product.name}</Text>

                  {/* New Price + Add Button Row */}
                  <View style={styles.priceAndButtonRow}>
                    <Text style={styles.productPrice}>₹{product.price}</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToCart(product)}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginBottom: 80 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  greeting: {
    padding: 16,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  promoSection: {
    marginBottom: 16,
  },
  promoScrollView: {
    marginVertical: 0,
  },
  bannerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  promoBanner: {
    width: '100%',
    height: 150,
  },
  promoTitleOverlay: {
    position: 'absolute',
    top: 10,
    left: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  promoTitleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007BFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  categoriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // Remove justifyContent: 'space-around' as margin will handle spacing
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 12, // Add horizontal margin to create a gap
  },
  categoryIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 100,
    backgroundColor: '#d7ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#e4dfe2', // Soft mint green for aesthetic look
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBEAD6',
    elevation: 3,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  priceAndButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#388E3C',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#30A58A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '1100',
  },
});
export default Home;