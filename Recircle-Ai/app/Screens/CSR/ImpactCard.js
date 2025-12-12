import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ImpactCard = ({ title, value, subtitle, color = '#4CAF50' }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    flex: 1,
    minWidth: 150,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

export default ImpactCard;