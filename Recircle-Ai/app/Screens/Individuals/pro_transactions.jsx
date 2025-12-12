import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const deliveryOptions = [
  { id: 1, name: "FedEx - 2-3 Days", image: require("../../../assets/images/fedex.png") },
  { id: 2, name: "usps.com - 1 Day", image: require("../../../assets/images/usps.jpg") },
  
];

const TransactionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.box}>
            <Text style={styles.textBold}>Jane Doe</Text>
            <Text>3 Newbridge Court</Text>
            <Text>Chino Hills, CA 91709, United States</Text>
            <TouchableOpacity>
              <Text style={styles.changeOption}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Details - Image & Description Together */}
        <View style={styles.productContainer}>
          <Image source={{ uri: params.image }} style={styles.productImage} resizeMode="cover" />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{params.product || "Product Name"}</Text>
            <Text style={styles.productDescription}>{params.description}</Text>
            <Text style={styles.productPrice}>₹{params.price}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.changeIcon}>
            <Ionicons name="pencil-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.boxRow}>
            <Image source={require('../../../assets/images/mastercard1.png')} style={styles.cardImage} />
            <Text>**** **** **** 3947</Text>
          </View>
        </View>

        {/* Delivery Method */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.changeIcon} onPress={() => {
            const nextIndex = (deliveryOptions.findIndex(opt => opt.id === selectedDelivery.id) + 1) % deliveryOptions.length;
            setSelectedDelivery(deliveryOptions[nextIndex]);
          }}>
            <Ionicons name="pencil-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <View style={styles.boxRow}>
            <Image source={selectedDelivery.image} style={styles.deliveryImage} />
            <Text>{selectedDelivery.name}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text>Order Amount: ₹{params.price}</Text>
          <Text>Delivery: Free</Text>
          <Text style={styles.totalPrice}>Total: ₹{params.price}</Text>
        </View>
      </ScrollView>

      {/* Submit Order Button */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={() => router.push('/Screens/Individuals/pro_order_confirm')}
      >
        <Text style={styles.submitButtonText}>Submit Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#FFF',
      elevation: 2,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 15,
    },
    section: {
      marginHorizontal: 20,
      marginTop: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    box: {
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      elevation: 2,
    },
    boxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      elevation: 2,
      justifyContent: 'space-between',
    },
    textBold: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    changeIcon: {
      position: 'absolute',
      right: 15,
      top: -5,
      zIndex: 1,
    },
    productContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      marginHorizontal: 20,
      marginTop: 15,
      padding: 15,
      borderRadius: 10,
      elevation: 3,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 15,
    },
    productInfo: {
      flex: 1,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    productDescription: {
      fontSize: 14,
      color: '#555',
      marginTop: 5,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#00A86B',
      marginTop: 5,
    },
    cardImage: {
      width: 150,
      height: 70,
      marginRight: 10,
    },
    deliveryImage: {
      width: 150,
      height: 70,
      marginRight: 10,
    },
    orderSummary: {
      marginHorizontal: 20,
      marginTop: 20,
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      elevation: 2,
    },
    totalPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#B33C00',
      marginTop: 10,
    },
    submitButton: {
      backgroundColor: '#B33C00',
      paddingVertical: 15,
      marginHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
    },
  });
  
export default TransactionScreen;