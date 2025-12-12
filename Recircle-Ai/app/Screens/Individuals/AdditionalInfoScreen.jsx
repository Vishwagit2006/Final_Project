import { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, Card, RadioButton, Text, useTheme, ActivityIndicator, HelperText, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateAdditionalInfo } from '../../../components/FormValidator';

const AdditionalInfoScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    listingType: 'sell',
    price: '',
    quantity: '1',
    location: '',
    logistics: 'pickup',
    condition: 'new',
    description: params.description || '',
    category: params.category || '',
    contactPreference: 'chat',
    donationVisibility: 'public',
    recipientName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft-product');
        if (draft) {
          const parsedDraft = JSON.parse(draft);
          setFormData(prev => ({
            ...prev,
            ...parsedDraft,
          }));
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };
    loadDraft();
  }, []);

  const handleSubmit = async () => {
    const validationErrors = validateAdditionalInfo(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const completeData = {
      ...params, // Includes title, imageUri, subcategory, reusable, reason
      ...formData,
      status: 'not claimed',
      timestamp: new Date().toISOString(),
      id: `product-${Date.now()}`,
    };

    try {
      setLoading(true);
      const storageKey = formData.listingType === 'sell' ? 'selling-products' : 'donation-products';
      const existingData = await AsyncStorage.getItem(storageKey) || '[]';
      const newData = [...JSON.parse(existingData), completeData];

      await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
      await AsyncStorage.removeItem('draft-product');

      router.push({
        pathname: '/Screens/Individuals/SuccessScreen',
        params: { listingType: formData.listingType },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save product data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor="#000000"
            size={28}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>
            Additional Details
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Listing Type
            </Text>
            <RadioButton.Group
              onValueChange={value => setFormData({ ...formData, listingType: value })}
              value={formData.listingType}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="sell" color="#B34523" />
                <Text variant="bodyMedium">Sell This Product</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="donate" color="#B34523" />
                <Text variant="bodyMedium">Donate This Product</Text>
              </View>
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors.listingType}>
              {errors.listingType}
            </HelperText>

            <Text variant="bodyMedium" style={styles.subTitle}>
              Condition
            </Text>
            <RadioButton.Group
              value={formData.condition}
              onValueChange={value => setFormData({ ...formData, condition: value })}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="new" color="#B34523" />
                <Text variant="bodyMedium">New</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="used" color="#B34523" />
                <Text variant="bodyMedium">Used</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="refurbished" color="#B34523" />
                <Text variant="bodyMedium">Refurbished</Text>
              </View>
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors.condition}>
              {errors.condition}
            </HelperText>

            {formData.listingType === 'sell' ? (
              <View>
                <TextInput
                  label="Price"
                  value={formData.price}
                  onChangeText={text => setFormData({ ...formData, price: text })}
                  keyboardType="decimal-pad"
                  mode="outlined"
                  error={!!errors.price}
                  activeOutlineColor="#B34523"
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.price}>
                  {errors.price}
                </HelperText>

                <TextInput
                  label="Quantity"
                  value={formData.quantity}
                  onChangeText={text => setFormData({ ...formData, quantity: text })}
                  keyboardType="numeric"
                  mode="outlined"
                  error={!!errors.quantity}
                  activeOutlineColor="#B34523"
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.quantity}>
                  {errors.quantity}
                </HelperText>

                <TextInput
                  label="Location"
                  value={formData.location}
                  onChangeText={text => setFormData({ ...formData, location: text })}
                  mode="outlined"
                  error={!!errors.location}
                  activeOutlineColor="#B34523"
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.location}>
                  {errors.location}
                </HelperText>
              </View>
            ) : (
              <View>
                <Text variant="bodyMedium" style={styles.subTitle}>
                  Donation Visibility
                </Text>
                <RadioButton.Group
                  value={formData.donationVisibility}
                  onValueChange={value => setFormData({ ...formData, donationVisibility: value })}
                >
                  <View style={styles.radioContainer}>
                    <RadioButton value="public" color="#B34523" />
                    <Text variant="bodyMedium">Public (Available to all)</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <RadioButton value="private" color="#B34523" />
                    <Text variant="bodyMedium">Private (Specific recipient)</Text>
                  </View>
                </RadioButton.Group>
                <HelperText type="error" visible={!!errors.donationVisibility}>
                  {errors.donationVisibility}
                </HelperText>

                {formData.donationVisibility === 'private' && (
                  <View>
                    <TextInput
                      label="Recipient Name"
                      value={formData.recipientName}
                      onChangeText={text => setFormData({ ...formData, recipientName: text })}
                      mode="outlined"
                      error={!!errors.recipientName}
                      activeOutlineColor="#B34523"
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.recipientName}>
                      {errors.recipientName}
                    </HelperText>
                  </View>
                )}

                <Text variant="bodyMedium" style={styles.subTitle}>
                  Logistics
                </Text>
                <RadioButton.Group
                  value={formData.logistics}
                  onValueChange={value => setFormData({ ...formData, logistics: value })}
                >
                  <View style={styles.radioContainer}>
                    <RadioButton value="pickup" color="#B34523" />
                    <Text variant="bodyMedium">Schedule Pickup</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <RadioButton value="dropoff" color="#B34523" />
                    <Text variant="bodyMedium">Drop-off Center</Text>
                  </View>
                </RadioButton.Group>
                <HelperText type="error" visible={!!errors.logistics}>
                  {errors.logistics}
                </HelperText>
              </View>
            )}

            <Text variant="bodyMedium" style={styles.subTitle}>
              Contact Preference
            </Text>
            <RadioButton.Group
              value={formData.contactPreference}
              onValueChange={value => setFormData({ ...formData, contactPreference: value })}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="chat" color="#B34523" />
                <Text variant="bodyMedium">In-App Chat</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="phone" color="#B34523" />
                <Text variant="bodyMedium">Phone</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="email" color="#B34523" />
                <Text variant="bodyMedium">Email</Text>
              </View>
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors.contactPreference}>
              {errors.contactPreference}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
            >
              {formData.listingType === 'sell' ? 'List Product' : 'Donate Goods'}
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
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  subTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#31DABD',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#B34523',
    borderRadius: 8,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default AdditionalInfoScreen;