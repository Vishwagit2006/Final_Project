import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = 'https://reshare-hub-bk.onrender.com/check-expiry';

const FoodDonationFormScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    storageMethod: 'Refrigerated',
    donationType: 'Public',
    ngoName: '',
    logistics: 'Own',
    pickupLocation: ''
  });

  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateDate = (dateStr) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const validateTime = (timeStr) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeStr);
  };

  const handleSubmit = async () => {
    if (!formData.foodType || !formData.quantity || !dateInput || !timeInput) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!validateDate(dateInput)) {
      Alert.alert('Error', 'Please enter a valid date in DD/MM/YYYY format');
      return;
    }

    if (!validateTime(timeInput)) {
      Alert.alert('Error', 'Please enter a valid time in HH:MM 24-hour format');
      return;
    }

    setIsSubmitting(true);

    try {
      const [day, month, year] = dateInput.split('/');
      const [hours, minutes] = timeInput.split(':');
      const parsedDate = new Date(year, month - 1, day, hours, minutes);

      const payload = {
        food: formData.foodType,
        quantity: formData.quantity,
        date: `${day}/${month}/${year}`,
        time: parsedDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(payload).toString(),
      });

      const result = await response.json();

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      if (result.reusable) {
        router.push({
          pathname: '/Screens/Business/foodSuccessScreen',
          params: {
            foodType: formData.foodType,
            quantity: formData.quantity,
            expiryDate: `${dateInput} ${timeInput}`,
            quality: result.quality
          }
        });
      } else {
        Alert.alert(
          'Expired Food',
          'This food item cannot be donated as it has expired',
          [
            {
              text: 'OK',
              onPress: () => console.log('Expired food alert dismissed')
            }
          ]
        );
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to the server. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Food Donation</Text>
        <Text style={styles.subHeader}>Help reduce waste by sharing surplus food</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Food Type *</Text>
        <TextInput
          mode="outlined"
          placeholder="e.g., Fresh Vegetables, Packaged Goods"
          value={formData.foodType}
          onChangeText={text => setFormData({ ...formData, foodType: text })}
          style={styles.input}
          left={<TextInput.Icon name="food" />}
          theme={{ roundness: 8 }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity (kg) *</Text>
        <TextInput
          mode="outlined"
          placeholder="Weight in kilograms"
          keyboardType="numeric"
          value={formData.quantity}
          onChangeText={text => setFormData({ ...formData, quantity: text.replace(/[^0-9]/g, '') })}
          style={styles.input}
          left={<TextInput.Icon name="weight" />}
          theme={{ roundness: 8 }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiration Date (DD/MM/YYYY) *</Text>
        <TextInput
          mode="outlined"
          placeholder="e.g., 25/04/2025"
          value={dateInput}
          onChangeText={text => {
            // Auto-format date input
            let formatted = text.replace(/[^0-9]/g, '');
            if (formatted.length > 2) {
              formatted = `${formatted.substring(0, 2)}/${formatted.substring(2)}`;
            }
            if (formatted.length > 5) {
              formatted = `${formatted.substring(0, 5)}/${formatted.substring(5, 9)}`;
            }
            setDateInput(formatted);
          }}
          style={styles.input}
          left={<TextInput.Icon name="calendar" />}
          theme={{ roundness: 8 }}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiration Time (HH:MM) *</Text>
        <TextInput
          mode="outlined"
          placeholder="e.g., 14:30"
          value={timeInput}
          onChangeText={text => {
            // Auto-format time input
            let formatted = text.replace(/[^0-9]/g, '');
            if (formatted.length > 2) {
              formatted = `${formatted.substring(0, 2)}:${formatted.substring(2, 4)}`;
            }
            setTimeInput(formatted);
          }}
          style={styles.input}
          left={<TextInput.Icon name="clock-outline" />}
          theme={{ roundness: 8 }}
          keyboardType="numeric"
          maxLength={5}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Donation Type</Text>
        <View style={styles.chipContainer}>
          <Chip
            selected={formData.donationType === 'Public'}
            mode="outlined"
            style={styles.chip}
            onPress={() => setFormData({ ...formData, donationType: 'Public' })}
          >
            Public
          </Chip>
          <Chip
            selected={formData.donationType === 'Private'}
            mode="outlined"
            style={styles.chip}
            onPress={() => setFormData({ ...formData, donationType: 'Private' })}
          >
            Private
          </Chip>
        </View>
      </View>

      {formData.donationType === 'Private' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>NGO Name</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter NGO name"
            value={formData.ngoName}
            onChangeText={text => setFormData({ ...formData, ngoName: text })}
            style={styles.input}
            left={<TextInput.Icon name="account-group" />}
            theme={{ roundness: 8 }}
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          mode="outlined"
          placeholder="Enter pickup address"
          value={formData.pickupLocation}
          onChangeText={text => setFormData({ ...formData, pickupLocation: text })}
          style={styles.input}
          left={<TextInput.Icon name="map-marker" />}
          theme={{ roundness: 8 }}
        />
      </View>

      <Button 
        mode="contained"
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Checking...' : 'Submit Donation'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F8FAFC'
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center'
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8
  },
  subHeader: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
    marginLeft: 4
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 12
  },
  chip: {
    height: 40,
    alignItems: 'center',
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: '#31DABD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 4
  }
});

export default FoodDonationFormScreen;