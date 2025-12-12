import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AlgorithmVisualizationScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);

  const stepTitles = [
    'Analyzing your profile',
    'Scanning available resources', 
    'Filtering by compatibility',
    'Ranking top matches',
    'Finalizing recommendations',
  ];

  const [steps, setSteps] = useState([
    { 
      id: 1, 
      title: 'Analyzing your profile', 
      status: 'In progress...',
      completed: false,
      active: true
    },
    { 
      id: 2, 
      title: 'Scanning available resources', 
      status: 'Pending',
      completed: false,
      active: false
    },
    { 
      id: 3, 
      title: 'Filtering by compatibility', 
      status: 'Pending',
      completed: false,
      active: false
    },
    { 
      id: 4, 
      title: 'Ranking top matches', 
      status: 'Pending',
      completed: false,
      active: false
    },
    { 
      id: 5, 
      title: 'Finalizing recommendations', 
      status: 'Pending',
      completed: false,
      active: false
    },
  ]);

  useEffect(() => {
    // Simulate algorithm progress
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        
        if (nextStep < stepTitles.length) {
          // Update steps status
          setSteps(prevSteps => 
            prevSteps.map((step, index) => {
              if (index < nextStep) {
                return { ...step, completed: true, active: false, status: 'Complete' };
              } else if (index === nextStep) {
                return { ...step, completed: false, active: true, status: 'In progress...' };
              } else {
                return { ...step, completed: false, active: false, status: 'Pending' };
              }
            })
          );
          return nextStep;
        } else {
          clearInterval(timer);
          // All steps completed
          setSteps(prevSteps => 
            prevSteps.map(step => ({
              ...step, 
              completed: true, 
              active: false, 
              status: 'Complete'
            }))
          );
          setTimeout(() => {
            router.push('/Screens/ngo/CallToActionScreen');
          }, 1000);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const getStepIcon = (step) => {
    if (step.completed) {
      return 'check-circle';
    } else if (step.active) {
      return 'clock';
    } else {
      return 'circle-outline';
    }
  };

  const getStepColor = (step) => {
    if (step.completed) {
      return '#10B981'; // Green
    } else if (step.active) {
      return '#3B82F6'; // Blue
    } else {
      return '#9CA3AF'; // Gray
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 16 }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <View style={styles.headerContent}>
          <Text variant="titleLarge" style={styles.headerTitle}>
            Finding Your Match
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Step 2 of 3
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text variant="headlineMedium" style={styles.mainTitle}>
            Finding your perfect match...
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Our smart algorithm is analyzing the best options for you.{'\n'}This should only take a moment.
          </Text>
        </View>

        {/* Steps List */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              {/* Step Icon */}
              <View style={styles.stepIconContainer}>
                <IconButton
                  icon={getStepIcon(step)}
                  iconColor={getStepColor(step)}
                  size={24}
                  style={styles.stepIcon}
                />
              </View>

              {/* Step Content */}
              <View style={styles.stepContent}>
                <Text variant="titleMedium" style={styles.stepTitle}>
                  {step.title}
                </Text>
                <Text variant="bodyMedium" style={[
                  styles.stepStatus,
                  { color: getStepColor(step) }
                ]}>
                  {step.status}
                </Text>
              </View>

              {/* Progress Line (except for last item) */}
              {index < steps.length - 1 && (
                <View style={[
                  styles.progressLine,
                  step.completed && styles.progressLineCompleted
                ]} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Cancel Button */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.cancelButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.cancelButtonLabel}
        >
          Cancel Search
        </Button>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    margin: 0,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: 20,
  },
  headerSubtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    padding: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 24,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    width: '100%',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    position: 'relative',
  },
  stepIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    margin: 0,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 8,
  },
  stepTitle: {
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
    fontSize: 16,
  },
  stepStatus: {
    fontWeight: '400',
    fontSize: 14,
  },
  progressLine: {
    position: 'absolute',
    left: 19, // Center of the icon
    top: 48, // Below the icon
    width: 2,
    height: 32, // Space between steps
    backgroundColor: '#E5E7EB',
  },
  progressLineCompleted: {
    backgroundColor: '#10B981',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    borderRadius: 8,
    borderColor: '#6B7280',
    borderWidth: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cancelButtonLabel: {
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default AlgorithmVisualizationScreen;