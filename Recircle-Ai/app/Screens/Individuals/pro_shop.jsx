import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const ShoppingBagScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState("1");
  const [deliveryDate, setDeliveryDate] = useState("1 May 2025");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bag</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productContainer}>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{params.product || "Product Name"}</Text>
            <Text style={styles.productCategory}>{params.category || "Category"}</Text>
            <Text style={styles.productPrice}>₹{params.price}</Text>

            <View style={styles.optionsContainer}>
              <Text>Size:</Text><TextInput style={styles.optionInput} value={size} onChangeText={setSize} placeholder="Size: M" />
              <Text>Quantity:</Text><TextInput style={styles.optionInput} value={quantity} onChangeText={setQuantity} placeholder="Qty: 1" keyboardType="numeric" />
            </View>

            <Text>Delivery Date:</Text><TextInput style={styles.deliveryInput} value={deliveryDate} onChangeText={setDeliveryDate} placeholder="Date" />
          </View>
        </View>

        <View style={styles.paymentContainer}>
          <Text style={styles.sectionTitle}>Order Payment Details</Text>
          <Text style={styles.paymentRow}>Order Amount: <Text style={styles.amount}>₹{params.price}</Text></Text>
          <Text style={styles.paymentRow}>Delivery Fee: <Text style={styles.freeDelivery}>Free</Text></Text>
          <View style={styles.divider} />
          <Text style={styles.paymentRow}>Order Total: <Text style={styles.total}>₹{params.price}</Text></Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => router.push(`/Screens/Individuals/pro_transactions?id=${params.id}&product=${params.product}&category=${params.category}&price=${params.price}&image=${params.image}`)}
      >
        <Text style={styles.paymentButtonText}>Proceed to Transactions</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'column', // Changed to column to center the title vertically within the container
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center', // Center items horizontally
  },
  productInfo: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center', // Center text within product info
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Ensure text itself is centered
    marginBottom: 5, // Add a little space below the title
  },
  productCategory: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A86B',
    marginTop: 5,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
    marginBottom: 10,
    alignItems: 'center', // Center items vertically in the row
    justifyContent: 'center', // Center items horizontally in the row
  },
  optionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    width: 80, // Give it a fixed width for better centering
  },
  deliveryInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  paymentContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightedLink: {
    color: '#D9534F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  freeDelivery: {
    color: '#00A86B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 15,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentButton: {
    backgroundColor: '#B33C00',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
export default ShoppingBagScreen;