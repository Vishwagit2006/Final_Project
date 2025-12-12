//AddproductScreen
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Card, TextInput, Text, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { productId, itemType } = params;
  const [itemData, setItemData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadItemData = async () => {
      const key = itemType === 'donation' ? 'donation-products' : 'selling-products';
      const items = await AsyncStorage.getItem(key);
      const parsedItems = JSON.parse(items) || [];
      const foundItem = parsedItems.find(item => item.id === productId);

      if (foundItem) {
        setItemData(foundItem);
        setFormData(foundItem);
      }
    };

    loadItemData();
  }, [productId, itemType]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const key = itemType === 'donation' ? 'donation-products' : 'selling-products';
      const items = await AsyncStorage.getItem(key);
      let parsedItems = JSON.parse(items) || [];
      const index = parsedItems.findIndex(item => item.id === productId);

      if (index !== -1) {
        parsedItems[index] = formData;
        await AsyncStorage.setItem(key, JSON.stringify(parsedItems));
        setItemData(formData);
        setIsEditing(false);
        Alert.alert('Success', 'Changes saved successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData(itemData);
    setIsEditing(false);
  };

  if (!itemData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="#000000"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: itemData.imageUri || 'https://via.placeholder.com/150' }}
            style={styles.cover}
          />
          <Card.Content style={styles.content}>
            {!isEditing ? (
              <>
                <Text style={styles.title}>{itemData.title}</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailValue}>{itemData.description || 'No description'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{itemData.category}</Text>
                </View>
                {itemType === 'donation' ? (
                  <>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Visibility</Text>
                      <Text style={styles.detailValue}>{itemData.donationVisibility}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Logistics</Text>
                      <Text style={styles.detailValue}>{itemData.logistics}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Price</Text>
                      <Text style={styles.detailValue}>₹{itemData.price}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>{itemData.quantity}</Text>
                    </View>
                  </>
                )}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Condition</Text>
                  <Text style={styles.detailValue}>{itemData.condition}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>{itemData.status}</Text>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  label="Title"
                  value={formData.title}
                  onChangeText={text => setFormData({ ...formData, title: text })}
                  style={styles.input}
                  mode="outlined"
                  activeOutlineColor="#B34523"
                  outlineStyle={styles.inputOutline}
                />
                <TextInput
                  label="Description"
                  value={formData.description}
                  onChangeText={text => setFormData({ ...formData, description: text })}
                  style={styles.input}
                  mode="outlined"
                  activeOutlineColor="#B34523"
                  outlineStyle={styles.inputOutline}
                  multiline
                  numberOfLines={4}
                />
                <TextInput
                  label="Category"
                  value={formData.category}
                  onChangeText={text => setFormData({ ...formData, category: text })}
                  style={styles.input}
                  mode="outlined"
                  activeOutlineColor="#B34523"
                  outlineStyle={styles.inputOutline}
                />
                {itemType === 'donation' ? (
                  <>
                    <TextInput
                      label="Visibility"
                      value={formData.donationVisibility}
                      onChangeText={text => setFormData({ ...formData, donationVisibility: text })}
                      style={styles.input}
                      mode="outlined"
                      activeOutlineColor="#B34523"
                      outlineStyle={styles.inputOutline}
                    />
                    <TextInput
                      label="Logistics"
                      value={formData.logistics}
                      onChangeText={text => setFormData({ ...formData, logistics: text })}
                      style={styles.input}
                      mode="outlined"
                      activeOutlineColor="#B34523"
                      outlineStyle={styles.inputOutline}
                    />
                  </>
                ) : (
                  <>
                    <TextInput
                      label="Price"
                      value={formData.price}
                      onChangeText={text => setFormData({ ...formData, price: text })}
                      style={styles.input}
                      mode="outlined"
                      activeOutlineColor="#B34523"
                      outlineStyle={styles.inputOutline}
                      keyboardType="numeric"
                    />
                    <TextInput
                      label="Quantity"
                      value={formData.quantity}
                      onChangeText={text => setFormData({ ...formData, quantity: text })}
                      style={styles.input}
                      mode="outlined"
                      activeOutlineColor="#B34523"
                      outlineStyle={styles.inputOutline}
                      keyboardType="numeric"
                    />
                  </>
                )}
                <TextInput
                  label="Condition"
                  value={formData.condition}
                  onChangeText={text => setFormData({ ...formData, condition: text })}
                  style={styles.input}
                  mode="outlined"
                  activeOutlineColor="#B34523"
                  outlineStyle={styles.inputOutline}
                />
                <TextInput
                  label="Status"
                  value={formData.status}
                  onChangeText={text => setFormData({ ...formData, status: text })}
                  style={styles.input}
                  mode="outlined"
                  activeOutlineColor="#B34523"
                  outlineStyle={styles.inputOutline}
                />
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {!isEditing ? (
          <Button
            mode="contained"
            style={styles.editButton}
            labelStyle={styles.buttonLabel}
            onPress={handleEditToggle}
          >
            Edit
          </Button>
        ) : (
          <View style={styles.editActions}>
            <Button
              mode="contained"
              style={styles.cancelButton}
              labelStyle={styles.buttonLabel}
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={styles.saveButton}
              labelStyle={styles.buttonLabel}
              onPress={handleSave}
            >
              Save
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B34523',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48, // Balances the IconButton
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space for button bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cover: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#31DABD',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  editButton: {
    backgroundColor: '#B34523',
    borderRadius: 8,
    elevation: 4,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#B34523',
    borderRadius: 8,
    marginLeft: 8,
    elevation: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666666',
    borderRadius: 8,
    marginRight: 8,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProductDetails;