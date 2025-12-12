import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const ProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();


  // Retrieve product details
  const productImage = params.image;
  const productTitle = params.product;
  const productCategory = params.category;
  const productDescription = params.description2;

  const productPrice = params.price;
  const productRating = parseFloat(params.rating); // Ensure it's a number

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>
            {productTitle || 'Product Name'}
          </Text>
          <Text style={styles.productType}>
            {productCategory || 'Category'}
          </Text>

          {/* Ratings */}
          <View style={styles.starContainer}>
  {[...Array(5)].map((_, index) => (
    <FontAwesome5
  key={index}
  name="star"
  solid={index < productRating}
  size={24}
  style={{
    color: index < productRating ? '#ffa500' : '#C0C0C0', // Inline style for color
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
  }}
/>
  ))}
</View>




          {/* Price */}
          <Text style={styles.salePrice}>₹{productPrice}</Text>

          {/* Description */}
          <Text style={styles.descriptionText}>
            {productDescription || 'No description available.'}
          </Text>
        </View>
      </ScrollView>

      {/* Services */}
      <View style={styles.servicesContainer}>
        <TouchableOpacity style={styles.serviceButton}>
          <Ionicons name="location-outline" size={20} color="#6B7280" />
          <Text style={styles.serviceText}>Nearest Store</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceButton}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
          <Text style={styles.serviceText}>VIP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceButton}>
          <Ionicons name="refresh-outline" size={20} color="#6B7280" />
          <Text style={styles.serviceText}>Return policy</Text>
        </TouchableOpacity>
      </View>

      {/* View Similar */}
      <TouchableOpacity style={styles.similarButton}>
        <Ionicons name="eye-outline" size={24} color="#1F2937" />
        <Text style={styles.similarButtonText}>View Similar</Text>
      </TouchableOpacity>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() =>
            router.push(
              `/Screens/Individuals/pro_shop?id=${params.id}&product=${params.product}&category=${params.category}&price=${params.price}&image=${params.image}`
            )
          }
        >
          <Text style={styles.buyNowText}>Buy now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  imageContainer: {
    width: '100%',
    height: 320,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  productType: {
    fontSize: 18,
    color: '#6B7280',
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  star: {
    marginRight: 5,
  },
  salePrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  serviceText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  similarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  similarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#B33C00',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#B33C00',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
