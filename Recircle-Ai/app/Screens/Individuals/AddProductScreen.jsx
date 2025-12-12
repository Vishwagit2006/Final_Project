import { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Image, StyleSheet, Platform } from 'react-native';
import { Button, TextInput, Card, useTheme, ActivityIndicator, Text, HelperText,IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { compressImage } from '../../../components/ImageCompressor';
import { validateProductForm } from '../../../components/FormValidator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProductScreen = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [reusable, setReusable] = useState(null);
  const [reason, setReason] = useState('');
  const router = useRouter();
  const theme = useTheme();
  // Determine API URL depending on environment so emulator/device can reach the local backend
  const getApiUrl = () => {
    // If running on Android emulator (classic), use 10.0.2.2
    if (Platform.OS === 'android' && !Constants.isDevice) {
      return 'http://10.0.2.2:5000';
    }

    // If iOS simulator, localhost works
    if (Platform.OS === 'ios' && !Constants.isDevice) {
      return 'http://127.0.0.1:5000';
    }

    // Fallback: use LAN IP (update this if your machine IP changes)
    // NOTE: For physical devices, ensure device and dev machine are on same network and firewall allows inbound port 5000
    return 'http://192.168.43.27:5000';
  };

  const apiUrl =  'http://10.230.46.27:5000'; // Update with your backend URL or use getApiUrl() for dynamic resolution
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLoading(true);
        const uri = result.assets[0].uri;
        const compressedUri = await compressImage(uri);
        setImage(compressedUri);

        // Clear form data and states immediately
        setFormData({
          title: '',
          description: '',
          category: '',
          subcategory: '',
        });
        setReusable(null);
        setReason('');
        setErrors({});
      } else {
        Alert.alert('No Image Selected', 'Please select an image to proceed.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNext = async () => {
    // First validate form data
    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        return; // Stop if form has errors
    }

    let isReusable = reusable;
    let reasonMessage = reason;

    // Check reusability if not already checked
    if (reusable === null && image) {
        const result = await processImageForReusability(image);
        isReusable = result.reusable;
        reasonMessage = result.reason;
    }

    // If not reusable after check, show alert and stop
    if (isReusable === false) {
        Alert.alert(
            'Product Not Reusable', 
            reasonMessage || 'This item cannot be reused or resold.',
            [{ text: 'OK', onPress: () => resetForm() }] // Reset form on alert dismissal
        );
        return;
    }

    // If reusability couldn't be determined
    if (isReusable === null) {
        Alert.alert(
            'Reusability Unknown',
            'Could not verify if this product is reusable. Please try again.',
            [{ text: 'OK' }]
        );
        return;
    }

    // Proceed if reusable is explicitly true
    if (isReusable === true) {
        await AsyncStorage.setItem('draft-product', JSON.stringify({
            ...formData,
            imageUri: image,
        }));

        router.push({
            pathname: 'Screens/Individuals/AdditionalInfoScreen',
            params: {
                ...formData,
                imageUri: image,
                reusable: 'true',
                reason: reasonMessage,
            },
        });
    }
};

const processImageForReusability = async (imageUri) => {
    if (!imageUri) return { reusable: null, reason: '' };

    try {
        setLoading(true);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'product.jpg',
      type: 'image/jpeg',
    });

    console.log(`POST ${apiUrl}/check-reusability`);

    // Add a simple fetch with timeout helper
    const fetchWithTimeout = (resource, options = {}) => {
      const { timeout = 15000 } = options;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      return fetch(resource, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(id));
    };

    const response = await fetchWithTimeout(`${apiUrl}/check-reusability`, {
      method: 'POST',
      body: formData,
      headers: {
        // Let react-native set Content-Type for multipart form-data; don't set it here
      }
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => null);
      console.error('Non-OK response', response.status, txt);
      return { reusable: null, reason: `Server error ${response.status}` };
    }

    const data = await response.json();

    if (data.error) {
      return { reusable: false, reason: data.error };
    }

    return { reusable: data.reusable, reason: data.reason || '' };
    } catch (error) {
        Alert.alert('Error', 'Failed to process image');
        return { reusable: null, reason: '' };
    } finally {
        setLoading(false);
    }
};


  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      subcategory: '',
    });
    setImage(null);
    setReusable(null);
    setReason('');
  };
  
  
  const processImage = async (imageUri) => {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected to process.');
      return;
    }
  
    try {
      setLoading(true);
      
      // Create FormData object
      const formDataToSend = new FormData();

      // Get filename from URI
      const filename = imageUri.split('/').pop();

      // Append the image file
      formDataToSend.append('image', {
        uri: imageUri,
        name: filename || 'product.jpg',
        type: 'image/jpeg',
      });

      console.log(`POST ${apiUrl}/generate-content`);

      const fetchWithTimeout = (resource, options = {}) => {
        const { timeout = 20000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        return fetch(resource, { ...options, signal: controller.signal })
          .finally(() => clearTimeout(id));
      };

      const response = await fetchWithTimeout(`${apiUrl}/generate-content`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => null);
        console.error('Non-OK response', response.status, txt);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
  
      if (data.reusable) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
        });
        setReusable(true);
        setReason('');
      } else {
        setReusable(false);
        setReason(data.reason || 'Image not reusable');
        Alert.alert('Not Reusable', data.reason || 'Image not reusable');
        setImage(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          subcategory: '',
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      const msg = error.name === 'AbortError' ? 'Request timed out' : (error.message || 'Network request failed');
      Alert.alert('Error', `Failed to process image: ${msg}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      exiting={SlideOutRight.duration(300)}
      style={[styles.container, { backgroundColor: '#ffffff' }]}
    >
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
          Add Goods
        </Text>
        <View style={styles.headerSpacer} />
      </View>
        {/* Image Section */}
        <Card style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Product Images
              </Text>
              {loading && <ActivityIndicator size="small" />}
            </View>

            <View style={styles.imageContainer}>
              {image ? (
                <Animated.Image 
                  source={{ uri: image }} 
                  style={styles.imagePreview}
                  sharedTransitionTag="product-image"
                  onError={() => {
                    Alert.alert('Error', 'Failed to load image');
                    setImage(null);
                  }}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text variant="bodyMedium" style={styles.placeholderText}>
                    No image selected
                  </Text>
                </View>
              )}
            </View>

            <Button
              mode="contained-tonal"
              onPress={pickImage}
              icon="image"
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={loading}
            >
              {image ? 'Change Image' : 'Select Image'}
            </Button>
          </Card.Content>
        </Card>

        {/* Product Details Section */}
        <Card style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Product Details
            </Text>

            <Animated.View entering={SlideInLeft.delay(100)}>
              <TextInput
                label="Product Title"
                value={formData.title}
                onChangeText={text => setFormData({ ...formData, title: text })}
                error={!!errors.title}
                mode="outlined"
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>
            </Animated.View>

            <Animated.View entering={SlideInLeft.delay(200)}>
              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={text => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                error={!!errors.description}
                mode="outlined"
                style={[styles.input, styles.multilineInput]}
              />
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            </Animated.View>

            <View style={styles.categoryRow}>
              <Animated.View entering={SlideInLeft.delay(300)} style={styles.categoryInput}>
                <TextInput
                  label="Category"
                  value={formData.category}
                  onChangeText={text => setFormData({ ...formData, category: text })}
                  error={!!errors.category}
                  mode="outlined"
                />
                <HelperText type="error" visible={!!errors.category}>
                  {errors.category}
                </HelperText>
              </Animated.View>

              <Animated.View entering={SlideInLeft.delay(400)} style={styles.categoryInput}>
                <TextInput
                  label="Subcategory"
                  value={formData.subcategory}
                  onChangeText={text => setFormData({ ...formData, subcategory: text })}
                  error={!!errors.subcategory}
                  mode="outlined"
                />
                <HelperText type="error" visible={!!errors.subcategory}>
                  {errors.subcategory}
                </HelperText>
              </Animated.View>
            </View>

            <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={() => image && processImage(image)}
              style={styles.nextButton}
              labelStyle={styles.nextButtonLabel}
              disabled={loading || !image}
          >
            {loading ? 'Processing...' : 'Use AI'}
              </Button>
              <Button 
                mode="contained" 
                onPress={handleNext}
                style={styles.nextButton}
                labelStyle={styles.nextButtonLabel}
                disabled={loading}
              >
                Next
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 48, // Same as back button width for balance
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: '#31DABD', // Your primary color
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  imageContainer: {
    aspectRatio: 16/9,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    
  },
  placeholderText: {
    color: '#616161',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonLabel: {
    color: '#FFFFFF', // White font color
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#B34523',
  },
  buttonLabel: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  multilineInput: {
    height: 100,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  categoryInput: {
    flex: 1,
  },
  helperText: {
    color: '#31DABD', // Match your theme color
    fontSize: 12,
    marginBottom: 8,
  },
  nextButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#B34523',
    color: '#FFFFFF',
  }
});

export default AddProductScreen;