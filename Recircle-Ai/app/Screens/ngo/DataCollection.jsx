import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, ProgressBar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DataCollectionScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState(null);

  const categories = [
    { id: 'housing', title: 'Housing', description: 'Find shelter and housing', icon: 'home-outline', color: '#6366F1' },
    { id: 'food', title: 'Food', description: 'Locate food banks', icon: 'food-apple-outline', color: '#10B981' },
    { id: 'healthcare', title: 'Healthcare', description: 'Access medical care', icon: 'hospital-building', color: '#EF4444' },
    { id: 'legal', title: 'Legal Aid', description: 'Get help with legal matters', icon: 'scale-balance', color: '#F59E0B' },
  ];

  const urgencyLevels = [
    { id: 'low', title: 'Low', color: '#10B981', icon: 'walk' },
    { id: 'medium', title: 'Medium', color: '#F59E0B', icon: 'run' },
    { id: 'high', title: 'High', color: '#EF4444', icon: 'alert-circle-outline' },
    { id: 'urgent', title: 'Urgent', color: '#DC2626', icon: 'alert-octagon' },
  ];

  const isFormComplete = selectedCategory && selectedUrgency;

  const handleFindMatch = () => {
    if (isFormComplete) {
      router.push('/Screens/ngo/AlgorithmVisualizationScreen');
    }
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E0E7FF', '#F8FAFC']}
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 16 }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <View style={styles.headerContent}>
          <Text variant="titleLarge" style={styles.headerTitle}>Find Your Match</Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>Step 1 of 3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={0.33} 
          style={styles.progressBar}
          color="#4F46E5"
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            What are you looking for?
          </Text>
          <Text variant="bodyLarge" style={styles.heroSubtitle}>
            Select the service you need assistance with
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          {categories.map((category) => (
            <Card
              key={category.id}
              style={[
                styles.optionCard,
                selectedCategory === category.id && styles.selectedCard
              ]}
              onPress={() => setSelectedCategory(category.id)}
              elevation={selectedCategory === category.id ? 4 : 2}
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                  <IconButton
                    icon={category.icon}
                    iconColor={category.color}
                    size={24}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    {category.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.cardDescription}>
                    {category.description}
                  </Text>
                </View>
                {selectedCategory === category.id && (
                  <IconButton
                    icon="check-circle"
                    iconColor={category.color}
                    size={24}
                  />
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Urgency Section */}
        <View style={styles.section}>
          <View style={styles.heroSection}>
            <Text variant="headlineSmall" style={styles.heroTitle}>
              How urgent is this?
            </Text>
            <Text variant="bodyLarge" style={styles.heroSubtitle}>
              Choose the urgency level of your need
            </Text>
          </View>
          
          <View style={styles.urgencyContainer}>
            {urgencyLevels.map((urgency) => (
              <Card
                key={urgency.id}
                style={[
                  styles.urgencyCard,
                  selectedUrgency === urgency.id && { 
                    borderColor: urgency.color,
                    backgroundColor: `${urgency.color}15`
                  }
                ]}
                onPress={() => setSelectedUrgency(urgency.id)}
                elevation={selectedUrgency === urgency.id ? 4 : 2}
              >
                <Card.Content style={styles.urgencyContent}>
                  <IconButton
                    icon={urgency.icon}
                    iconColor={selectedUrgency === urgency.id ? urgency.color : '#6B7280'}
                    size={28}
                  />
                  <Text variant="titleMedium" style={[
                    styles.urgencyText,
                    selectedUrgency === urgency.id && { color: urgency.color }
                  ]}>
                    {urgency.title}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Find Match Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleFindMatch}
          disabled={!isFormComplete}
          style={[
            styles.findButton,
            !isFormComplete && styles.disabledButton
          ]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Find Match Now
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    margin: 0,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 40,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    borderRadius: 12,
    marginRight: 16,
  },
  icon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  urgencyCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  urgencyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  urgencyText: {
    fontWeight: '600',
    marginTop: 8,
    color: '#1F2937',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  findButton: {
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default DataCollectionScreen;