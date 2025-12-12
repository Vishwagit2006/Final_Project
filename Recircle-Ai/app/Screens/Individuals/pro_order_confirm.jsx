//Individuals/pro_order_confirm.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const OrderConfirmationScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Success Icon */}
      <View style={styles.imageContainer}>
        <Image source={require('../../../assets/images/pro_trac_succ.png')} style={styles.successImage} />
      </View>

      {/* Success Message */}
      <Text style={styles.successText}>Success!</Text>
      <Text style={styles.messageText}>Your order will be delivered soon.</Text>
      <Text style={styles.messageText}>Thank you for choosing our app!</Text>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Continue Shopping Button */}
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={() => router.push('/Screens/Individuals/Home')}
        >
          <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>

        {/* Rate Your Experience Button */}
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => router.push('/shared/ReviewSystem')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>RATE YOUR EXPERIENCE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  successImage: {
    width: 400,
    height: 400,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00A86B',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#D9534F',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D9534F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#D9534F',
  },
});

export default OrderConfirmationScreen;