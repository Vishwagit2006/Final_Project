import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, Image } from 'react-native';
import { Button, TextInput, Card, RadioButton, Text, ActivityIndicator, IconButton, HelperText } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


 // Charity / Donation-related image

const BusinessListingDetails = () => {
  const router = useRouter();
  const { listingId } = useLocalSearchParams();
  const [listing, setListing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const [donations, listings] = await Promise.all([
          AsyncStorage.getItem('business-donations'),
          AsyncStorage.getItem('business-listings'),
        ]);

        const allListings = [
          ...(donations ? JSON.parse(donations) : []),
          ...(listings ? JSON.parse(listings) : []),
        ];

        const foundListing = allListings.find(item => item.id === listingId);
        
        if (foundListing) {
          setListing(foundListing);
          setFormData(foundListing);
        } else {
          Alert.alert('Error', 'Listing not found');
          router.back();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load listing');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const storageKey = formData.listingType === 'ngo-donation' 
        ? 'business-donations' 
        : 'business-listings';

      const currentData = await AsyncStorage.getItem(storageKey);
      let listings = currentData ? JSON.parse(currentData) : [];
      
      const index = listings.findIndex(item => item.id === listingId);
      if (index === -1) throw new Error('Listing not found');

      // Preserve existing image if not changed
      const updatedData = {
        ...listings[index],
        ...formData,
        imageUrl: formData.imageUrl || listings[index].imageUrl
      };

      listings[index] = updatedData;
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(listings));
      setEditMode(false);
      Alert.alert('Success', 'Listing updated successfully');
      router.push('/Screens/Business/BusinessProvideGoods');
    } catch (error) {
      Alert.alert('Error', 'Failed to update listing');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const storageKey = listing.listingType === 'ngo-donation' 
                ? 'business-donations' 
                : 'business-listings';

              const currentData = await AsyncStorage.getItem(storageKey);
              let listings = currentData ? JSON.parse(currentData) : [];
              
              const updatedListings = listings.filter(item => item.id !== listingId);
              await AsyncStorage.setItem(storageKey, 
                updatedListings.length > 0 ? JSON.stringify(updatedListings) : ''
              );
              
              Alert.alert('Success', 'Listing deleted successfully');
              router.push('/Screens/Business/BusinessProvideGoods');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete listing');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imageUrl: result.assets[0].uri });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.businessName) errors.businessName = 'Required';
    if (!formData.bulkQuantity) errors.bulkQuantity = 'Required';
    if (!formData.description) errors.description = 'Required';
    if (formData.listingType !== 'ngo-donation' && !formData.pricePerUnit) {
      errors.pricePerUnit = 'Required';
    }
    if (formData.listingType === 'ngo-donation' && !formData.urgency) {
      errors.urgency = 'Required';
    }
    return errors;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B34523" />
      </View>
    );
  }

  if (!listing) return null;

  // Default stock image URLs for donations and bulk listings
  const donationImageUrl = "https://images.unsplash.com/photo-1581091012181-4e99eae928ad"; // Donation-related image
  const bulkListingImageUrl = "https://images.unsplash.com/photo-1604076876441-9c11b4a3f57b"; // Bulk listing-related image

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              onPress={() => router.back()}
              iconColor="#000000"
            />
            <Text variant="titleLarge" style={styles.title}>
              {editMode ? 'Edit Listing' : 'Listing Details'}
            </Text>
            <View style={styles.headerActions}>
              {!editMode && (
                <IconButton
                  icon="pencil"
                  onPress={() => setEditMode(true)}
                  iconColor="#B34523"
                />
              )}
            </View>
          </View>

          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: formData.imageUrl || (formData.listingType === 'ngo-donation' ? donationImageUrl : bulkListingImageUrl) }} 
              style={styles.image}
              resizeMode="cover"
            />
            {editMode && (
              <Button 
                mode="outlined" 
                style={styles.imageButton}
                onPress={handleImagePick}
              >
                Change Image
              </Button>
            )}
          </View>

          {/* Editable Fields */}
          <TextInput
            label="Business Name *"
            value={formData.businessName || ''}
            onChangeText={text => setFormData({ ...formData, businessName: text })}
            error={!!errors.businessName}
            disabled={!editMode}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.businessName}>
            {errors.businessName}
          </HelperText>

          <TextInput
            label="Title *"
            value={formData.title || ''}
            onChangeText={text => setFormData({ ...formData, title: text })}
            disabled={!editMode}
            style={styles.input}
          />

          <TextInput
            label="Description *"
            value={formData.description || ''}
            onChangeText={text => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            disabled={!editMode}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.description}>
            {errors.description}
          </HelperText>

          <TextInput
            label="Bulk Quantity *"
            value={formData.bulkQuantity || ''}
            onChangeText={text => setFormData({ ...formData, bulkQuantity: text })}
            error={!!errors.bulkQuantity}
            disabled={!editMode}
            keyboardType="numeric"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.bulkQuantity}>
            {errors.bulkQuantity}
          </HelperText>

          {formData.listingType !== 'ngo-donation' && (
            <>
              <TextInput
                label="Price Per Unit (₹) *"
                value={formData.pricePerUnit || ''}
                onChangeText={text => setFormData({ ...formData, pricePerUnit: text })}
                error={!!errors.pricePerUnit}
                disabled={!editMode}
                keyboardType="numeric"
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.pricePerUnit}>
                {errors.pricePerUnit}
              </HelperText>
            </>
          )}

          {formData.listingType === 'ngo-donation' && (
            <>
              <Text style={styles.sectionTitle}>Urgency Level *</Text>
              <RadioButton.Group
                value={formData.urgency}
                onValueChange={value => setFormData({ ...formData, urgency: value })}
              >
                <View style={styles.radioContainer}>
                  <RadioButton value="high" disabled={!editMode} color="#B34523" />
                  <Text>High Urgency</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton value="medium" disabled={!editMode} color="#B34523" />
                  <Text>Medium Urgency</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton value="low" disabled={!editMode} color="#B34523" />
                  <Text>Low Urgency</Text>
                </View>
              </RadioButton.Group>
              <HelperText type="error" visible={!!errors.urgency}>
                {errors.urgency}
              </HelperText>
            </>
          )}

          <TextInput
            label="Contact Person"
            value={formData.contactPerson || ''}
            onChangeText={text => setFormData({ ...formData, contactPerson: text })}
            disabled={!editMode}
            style={styles.input}
          />

          <TextInput
            label="Contact Email"
            value={formData.contactEmail || ''}
            onChangeText={text => setFormData({ ...formData, contactEmail: text })}
            disabled={!editMode}
            keyboardType="email-address"
            style={styles.input}
          />

          {editMode ? (
            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                style={styles.button}
                onPress={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <Button
              mode="contained"
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              Delete Listing
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#B34523',
    fontWeight: 'bold',
    fontSize: 20,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButton: {
    marginTop: 10,
    borderColor: '#B34523',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B34523',
    marginVertical: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#B34523',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    marginTop: 24,
  },
});

export default BusinessListingDetails;
