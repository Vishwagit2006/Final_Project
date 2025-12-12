import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ product, onPress, onAddToCart, index }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
  
    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300 + index * 50, // Staggered fade-in
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 20,
          friction: 7,
          delay: index * 50, // Staggered slide-in
        }),
      ]).start();
    }, [fadeAnim, slideAnim, index]);
  
    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        friction: 5,
        tension: 10,
      }).start();
    };
  
    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 10,
      }).start(() => onPress(product.detailsRoute));
    };
  
    return (
      <Animated.View
        style={{
          ...styles.productCard,
          transform: [{ scale: scaleValue }, { translateY: slideAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
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
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddToCart(product)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
const products = [
    {
      name: "Iron box",
      price: "₹299",
      image: { uri: "https://m.media-amazon.com/images/I/51YoZ-I6nuL.jpg"}, // Replace with your actual image path
      rating: 4.8,
      detailsRoute: '/product/iron-box',
    },
    {
      name: "Led Television",
      price: "₹9,999",
      image: { uri: "https://sathya.in/media/90993/catalog/panasonic_MS550%20-%20Smart%20TV_01.jpg"}, // Replace with your actual image path
      rating: 4.5,
      detailsRoute: '/product/led-television',
    },
    {
      name: "Study table",
      price: "₹1,499",
      image: { uri: "https://m.media-amazon.com/images/I/81GBoZTQ9dL.jpg"}, // Replace with your actual image path
      rating: 4.2,
      detailsRoute: '/product/study-table',
    },
    {
      name: "Dining table",
      price: "₹6,599",
      image: { uri: "https://rukminim3.flixcart.com/image/850/1000/k47cgi80/dining-set/f/g/k/8-seater-brown-rosewood-sheesham-hhfk-17-hariom-handicraft-original-imafn66rskcnv96g.jpeg?q=90&crop=false"}, // Replace with your actual image path
      rating: 4.8,
      detailsRoute: '/product/dining-table',
    },
    {
      name: "Calculator",
      price: "₹199",
      image: { uri: "https://5.imimg.com/data5/GP/AL/MY-4558736/calculators-2-500x500.jpg"}, // Replace with your actual image path
      rating: 4.6,
      detailsRoute: '/product/calculator',
    },
    {
      name: "I Phone",
      price: "₹29,999",
      image: { uri: "https://idestiny.in/wp-content/uploads/2024/10/iPhone_16_Pro_White_Titanium_PDP_Image_Position_1__en-IN.jpg"}, // Replace with your actual image path
      rating: 4.8,
      detailsRoute: '/product/iphone',
    },
    {
        name: "Airpodes",
        price: "₹999",
        image: { uri: "https://rukminim3.flixcart.com/image/850/1000/kpinwy80/headphone/p/p/r/mwp22hn-a-apple-original-imag3qe9d7butvku.jpeg?q=20&crop=false"}, // Replace with your actual image path
        rating: 4.8,
        detailsRoute: '/product/airpodes',
      },
      {
        name: "Mens Shirts",
        price: "₹299",
        image: { uri: "https://www.textileinfomedia.com/img/enlo/new-collection-casual-shirt-for-men-full.jpg"}, // Replace with your actual image path
        rating: 4.5,
        detailsRoute: '/product/shirts',
      },
      

    // Add more products here...
  ];

const ProductsPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleFilter = () => {
    // Implement your filter logic here
    console.log('Filter pressed');
  };

  const handleProductPress = (detailsRoute) => {
    router.push(detailsRoute);
  };

  const handleAddToCart = (product) => {
    // Implement your add to cart logic here
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity onPress={handleFilter}>
          <Ionicons name="options-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
  
      {/* Product List */}
      <ScrollView contentContainerStyle={styles.productListContainer}>
        <Text style={styles.itemCount}>1000+ Items</Text>
        <View style={styles.productsGrid}>
          {products.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productCard}
              onPress={() => handleProductPress(product.detailsRoute)}
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
                    <Text style={styles.productPrice}>{product.price}</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemCount: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#E6F4EA', // Soft mint green for aesthetic look
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBEAD6',
    elevation: 3,
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
    fontWeight: '600',
  },
});
export default ProductsPage;