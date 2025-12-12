import { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, Card, RadioButton, Text, useTheme, ActivityIndicator, HelperText, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { db, storage } from '../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateAdditionalInfo } from '../../../components/FormValidator';

const BusinessAdditionalInfo = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'manufacturer',
    taxID: '',
    imageUrl: params.imageUri || '',
    listingType: 'wholesale',
    bulkQuantity: '',
    pricePerUnit: '',
    location: '',
    logistics: 'delivery',
    certification: '',
    description: params.description || '',
    category: params.category || '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    recipientOrg: '',
    urgency: 'medium', // Added urgency field here
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log('Form submission initiated.'); // Debug
  
    const validationErrors = validateAdditionalInfo(formData, 'business');
    console.log('Validation Errors:', validationErrors); // Debug
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      console.log('Form submission halted due to validation errors.'); // Debug
      return;
    }
  
    setLoading(true);
    console.log('Loading state set to true.'); // Debug
  
    try {
      // Request location permissions
      console.log('Requesting location permissions...'); // Debug
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is needed to list your product.');
        console.log('Location permission denied.'); // Debug
        return;
      }
      console.log('Location permission granted.'); // Debug
  
      // Fetch the current location
      console.log('Fetching current location...'); // Debug
      let location = await Location.getCurrentPositionAsync({});
      const coords = location?.coords || { latitude: 0, longitude: 0 };
      console.log('Current location:', coords); // Debug
  
      // Fetch location name from Photon API
      console.log('Fetching location name from Photon API...'); // Debug
      const photonResponse = await fetch(
        `https://photon.komoot.io/reverse?lat=${coords.latitude}&lon=${coords.longitude}`
      );
      const photonData = await photonResponse.json();
      const address = photonData?.features?.[0]?.properties || {};
      const locationName = [address.name, address.city, address.country].filter(Boolean).join(', ') || 'Unknown Location';
      console.log('Fetched location name:', locationName); // Debug
  
      // Prepare minimal data for Firestore
      const listingData = {
        name: params.title,
        imageUrl: params.imageUri,
        location: { latitude: coords.latitude, longitude: coords.longitude },
        locationName,
        timestamp: new Date().toISOString(),
      };
      console.log('Prepared listing data:', listingData); // Debug
  
      // Save to appropriate Firestore collection
      const collectionName = formData.listingType === 'ngo-donation' ? 'donations' : 'bulk-listings';
      console.log(`Saving to Firestore collection: ${collectionName}`); // Debug
      await setDoc(doc(db, collectionName, Date.now().toString()), listingData);
      console.log('Data saved to Firestore successfully.'); // Debug
  
      // Save full formData to AsyncStorage
      const storageKey = formData.listingType === 'ngo-donation' ? 'business-donations' : 'business-listings';
      console.log(`Saving full form data to AsyncStorage under key: ${storageKey}`); // Debug
      const existingData = await AsyncStorage.getItem(storageKey);
      const parsedData = existingData ? JSON.parse(existingData) : [];
      parsedData.push(formData);
      await AsyncStorage.setItem(storageKey, JSON.stringify(parsedData));
      console.log('Data saved to AsyncStorage successfully.'); // Debug
  
      Alert.alert('Success', 'Your listing has been saved!');
      console.log('Form submission completed successfully.'); // Debug
      router.push('/Screens/Business/SucessScreen');
    } catch (error) {
      console.error('Unhandled Error:', error); // Debug
      Alert.alert('Error', 'An error occurred: ' + error.message);
    } finally {
      setLoading(false);
      console.log('Loading state set to false.'); // Debug
    }
  };

  

  {formData.listingType === 'ngo-donation' && (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Urgency Level *
      </Text>
      <RadioButton.Group
        value={formData.urgency}
        onValueChange={value => setFormData({ ...formData, urgency: value })}
      >
        <View style={styles.radioContainer}>
          <RadioButton value="high" color="#B34523" />
          <Text>High (Needs immediate attention)</Text>
        </View>
        <View style={styles.radioContainer}>
          <RadioButton value="medium" color="#B34523" />
          <Text>Medium (Required within 1 week)</Text>
        </View>
        <View style={styles.radioContainer}>
          <RadioButton value="low" color="#B34523" />
          <Text>Low (Flexible timeline)</Text>
        </View>
      </RadioButton.Group>
    </>
  )}

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor="#000000"
            size={28}
            onPress={() => router.back()}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>
            Business Listing Details
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <Card style={styles.section}>
          <Card.Content>
            {/* Business Information */}
            <TextInput
              label="Business Name *"
              value={formData.businessName}
              onChangeText={text => setFormData({ ...formData, businessName: text })}
              error={!!errors.businessName}
              mode="outlined"
              style={styles.input}
            />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Business Type *
            </Text>
            <RadioButton.Group
              value={formData.businessType}
              onValueChange={value => setFormData({ ...formData, businessType: value })}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="manufacturer" color="#B34523" />
                <Text>Manufacturer</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="retailer" color="#B34523" />
                <Text>Retailer</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="distributor" color="#B34523" />
                <Text>Distributor</Text>
              </View>
            </RadioButton.Group>

            <TextInput
              label="Tax ID/VAT Number *"
              value={formData.taxID}
              onChangeText={text => setFormData({ ...formData, taxID: text })}
              error={!!errors.taxID}
              mode="outlined"
              style={styles.input}
            />

            {/* Listing Details */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Listing Type *
            </Text>
            <RadioButton.Group
              value={formData.listingType}
              onValueChange={value => setFormData({ ...formData, listingType: value })}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="wholesale" color="#B34523" />
                <Text>Wholesale</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="b2b" color="#B34523" />
                <Text>B2B</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="ngo-donation" color="#B34523" />
                <Text>NGO Donation</Text>
              </View>
            </RadioButton.Group>

            <TextInput
              label="Bulk Quantity *"
              value={formData.bulkQuantity}
              onChangeText={text => setFormData({ ...formData, bulkQuantity: text })}
              keyboardType="numeric"
              error={!!errors.bulkQuantity}
              mode="outlined"
              style={styles.input}
            />

            {formData.listingType !== 'ngo-donation' && (
              <TextInput
                label="Price Per Unit (₹) *"
                value={formData.pricePerUnit}
                onChangeText={text => setFormData({ ...formData, pricePerUnit: text })}
                keyboardType="numeric"
                error={!!errors.pricePerUnit}
                mode="outlined"
                style={styles.input}
              />
            )}

            {formData.listingType === 'ngo-donation' && (
              <TextInput
                label="Recipient Organization"
                value={formData.recipientOrg}
                onChangeText={text => setFormData({ ...formData, recipientOrg: text })}
                mode="outlined"
                style={styles.input}
              />
            )}

            <TextInput
              label="Certification (ISO, etc)"
              value={formData.certification}
              onChangeText={text => setFormData({ ...formData, certification: text })}
              mode="outlined"
              style={styles.input}
            />

            {/* Logistics */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Logistics *
            </Text>
            <RadioButton.Group
              value={formData.logistics}
              onValueChange={value => setFormData({ ...formData, logistics: value })}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="delivery" color="#B34523" />
                <Text>Delivery</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="pickup" color="#B34523" />
                <Text>Pickup</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="third-party" color="#B34523" />
                <Text>Third-Party Logistics</Text>
              </View>
            </RadioButton.Group>

            {/* Contact Information */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Contact Information *
            </Text>
            <TextInput
              label="Contact Person"
              value={formData.contactPerson}
              onChangeText={text => setFormData({ ...formData, contactPerson: text })}
              error={!!errors.contactPerson}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Contact Email"
              value={formData.contactEmail}
              onChangeText={text => setFormData({ ...formData, contactEmail: text })}
              keyboardType="email-address"
              error={!!errors.contactEmail}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Contact Phone"
              value={formData.contactPhone}
              onChangeText={text => setFormData({ ...formData, contactPhone: text })}
              keyboardType="phone-pad"
              error={!!errors.contactPhone}
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
            >
              {formData.listingType === 'ngo-donation' 
                ? 'Publish Donation' 
                : 'List Bulk Items'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSpacer: {
    width: 48,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
    color: '#B34523',
    marginTop: 12,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#B34523',
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BusinessAdditionalInfo;