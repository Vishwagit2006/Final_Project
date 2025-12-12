import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function SuccessScreen(){
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={100} color="#31DABD" />
      <Text style={styles.title}>Donation Submitted!</Text>
      <Text style={styles.subtitle}>Thank you for contributing to reduce food waste.</Text>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => router.push('/')}
      >
        Back to Home
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#31DABD',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});