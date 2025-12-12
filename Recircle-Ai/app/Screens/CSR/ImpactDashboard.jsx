import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, 
  Alert, ActivityIndicator, Linking, Modal, Animated 
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImpactCard from '../CSR/ImpactCard';
import ImpactChart from '../CSR/ImpactChart';
import { Config } from './config';
import CSRReportScreen from '../CSR/CSRReportScreen';

// Enhanced helper functions with standards compliance
const getOverallImpactLevel = (score) => {
  if (score >= 600) return "Environmental Champion 🌟";
  if (score >= 450) return "Eco Warrior 🦸‍♂️";
  if (score >= 300) return "Green Guardian 🌿";
  if (score >= 200) return "Planet Protector 🌎";
  if (score >= 100) return "Eco Beginner 🌱";
  if (score >= 50) return "Eco Starter 🌿";
  return "Getting Started 🚀";
};

const getScoreColor = (score) => {
  if (score >= 600) return '#FFD700';
  if (score >= 450) return '#4CAF50';
  if (score >= 300) return '#2196F3';
  if (score >= 200) return '#FF9800';
  if (score >= 100) return '#9C27B0';
  return '#607D8B';
};

const getCategoryColor = (category) => {
  const colors = {
    'Food': '#4CAF50',
    'Clothes': '#2196F3',
    'Electronics': '#FF9800',
    'Furniture': '#9C27B0',
    'Books': '#607D8B'
  };
  return colors[category] || '#666';
};

const ImpactDashboard = () => {
  const [impactData, setImpactData] = useState([]);
  const [csrSummary, setCsrSummary] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showCSRModal, setShowCSRModal] = useState(false);
  const [standardsInfo, setStandardsInfo] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    category: 'Food',
    quantity_kg: '',
    distance_km: '0',
    description: ''
  });

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    checkBackendHealth();
    fetchInitialData();
    fetchStandardsInfo();
    setupFirebaseListeners();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const setupFirebaseListeners = () => {
    const unsubscribeImpact = onSnapshot(
      collection(db, 'impact_reports'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        console.log('✅ Firebase impact data updated:', data.length, 'records');
      },
      (error) => {
        console.log('ℹ️ Firebase offline - using backend API');
      }
    );

    return () => {
      unsubscribeImpact();
    };
  };

  const fetchStandardsInfo = async () => {
    try {
      const response = await fetch(`${Config.API_BASE_URL}/standards-info`);
      if (response.ok) {
        const result = await response.json();
        setStandardsInfo(result.standards);
      }
    } catch (error) {
      console.log('⚠️ Could not fetch standards info');
    }
  };

  const fetchInitialData = async () => {
    try {
      console.log('🔄 Fetching initial data from backend...');
      const [impactResponse, csrResponse] = await Promise.all([
        fetch(`${Config.API_BASE_URL}/impact-reports`),
        fetch(`${Config.API_BASE_URL}/csr-summary`)
      ]);

      if (impactResponse.ok) {
        const impactResult = await impactResponse.json();
        console.log('📊 Impact data loaded:', impactResult.data?.length || 0, 'records');
        setImpactData(impactResult.data || []);
      } else {
        console.log('❌ Failed to fetch impact reports:', impactResponse.status);
      }

      if (csrResponse.ok) {
        const csrResult = await csrResponse.json();
        console.log('📋 Enhanced CSR summary loaded:', csrResult.data);
        setCsrSummary(csrResult.data);
      } else {
        console.log('❌ Failed to fetch CSR summary:', csrResponse.status);
      }
    } catch (error) {
      console.log('⚠️ Using default data - backend not available:', error);
    }
  };

  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${Config.API_BASE_URL}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        setBackendStatus('connected');
        console.log('✅ Backend connected successfully with standards compliance');
      } else {
        setBackendStatus('error');
        console.log('❌ Backend responded with error');
      }
    } catch (error) {
      console.log('Backend health check failed - using local mode');
      setBackendStatus('error');
    }
  };

  // ADDED BACK: Missing function
  const retryBackendConnection = () => {
    setBackendStatus('checking');
    checkBackendHealth();
    fetchInitialData();
  };

  // ADDED BACK: Missing function
  const testImpactCalculation = async () => {
    try {
      console.log('🧪 Testing impact calculation...');
      const response = await fetch(`${Config.API_BASE_URL}/test-impact`);
      const result = await response.json();
      console.log('Test results:', result);
      
      if (result.status === 'success') {
        Alert.alert('Test Successful', 'Backend impact calculation is working! Check console for details.');
        fetchInitialData();
      }
    } catch (error) {
      console.error('Test failed:', error);
      Alert.alert('Test Failed', 'Backend test failed - check console for details');
    }
  };

  // ADDED BACK: Missing function
  const validateDataConsistency = () => {
    console.log('🔍 VALIDATING DATA CONSISTENCY:');
    console.log('Impact Data Length:', impactData.length);
    
    const impactDataTotalScore = impactData.reduce((sum, item) => sum + (item.impact_score || 0), 0);
    const impactDataAvgScore = impactData.length > 0 ? impactDataTotalScore / impactData.length : 0;
    
    console.log('Impact Data - Total Score:', impactDataTotalScore, 'Avg Score:', impactDataAvgScore);
    console.log('CSR Summary - Total Score:', csrSummary?.total_impact_score, 'Avg Score:', csrSummary?.average_impact_score);
    console.log('CSR Summary - Total Impacts:', csrSummary?.total_impacts);
    
    if (csrSummary && Math.abs(impactDataTotalScore - csrSummary.total_impact_score) > 1) {
      console.warn('⚠️ SCORE MISMATCH DETECTED!');
      console.warn('Impact Data Total:', impactDataTotalScore);
      console.warn('CSR Total:', csrSummary.total_impact_score);
      console.warn('Difference:', impactDataTotalScore - csrSummary.total_impact_score);
      Alert.alert('Data Inconsistency', 'Score mismatch detected between impact data and CSR summary. Consider migrating scores.');
    } else {
      console.log('✅ Data is consistent');
      Alert.alert('Data Valid', 'All data is consistent and synchronized!');
    }
  };

  const handleAddImpact = async () => {
    if (!newTransaction.quantity_kg || newTransaction.quantity_kg <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      console.log('📤 Sending impact calculation request:', newTransaction);
      
      const response = await fetch(`${Config.API_BASE_URL}/calculate-impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: newTransaction.category,
          quantity_kg: parseFloat(newTransaction.quantity_kg),
          distance_km: parseFloat(newTransaction.distance_km),
          description: newTransaction.description
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      console.log('📥 Received enhanced response:', result);

      if (result.status === 'success' || result.status === 'partial_success') {
        const impact = result.impact;
        
        // Enhanced alert with CO₂e information
        Alert.alert('Success ✅', 
          `Impact Score: ${impact.impact_score} ⭐\nLevel: ${impact.impact_level}\n\n🌱 CO₂e: ${impact.co2e_saved_kg || impact.co2_saved_kg}kg (All greenhouse gases)\n💧 Water: ${impact.water_saved_l}L\n🗑️ Waste: ${impact.waste_diverted_kg}kg`,
          [{ text: 'OK', style: 'default' }]
        );
        
        setShowAddForm(false);
        setNewTransaction({
          category: 'Food',
          quantity_kg: '',
          distance_km: '0',
          description: ''
        });
        
        await fetchInitialData();
        
      } else {
        Alert.alert('Error', result.message || 'Failed to calculate impact');
      }
    } catch (error) {
      console.error('API call error:', error);
      if (error.name === 'AbortError') {
        Alert.alert('Timeout', 'Request took too long. Please try again.');
      } else {
        Alert.alert(
          'Connection Error', 
          'Cannot connect to backend server.',
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Retry', onPress: checkBackendHealth }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // NEW: Show standards information
  const showStandardsInfo = () => {
    if (!standardsInfo) {
      Alert.alert('Standards Info', 'Loading standards information...');
      return;
    }

    const message = `
🌍 INTERNATIONAL STANDARDS COMPLIANCE 🌍

📊 GHG Protocol:
• Standardized greenhouse gas accounting
• Scope 3 avoided emissions calculation
• CO₂e (Carbon Dioxide Equivalent) metrics

🔬 ISO 14040:
• Life Cycle Assessment compliance
• Cradle-to-grave environmental impact
• Multi-category impact assessment

🔄 UNEP Circular Economy:
• Material circularity tracking
• Waste prevention metrics
• Sustainable resource management

All calculations follow international environmental accounting standards.
    `.trim();

    Alert.alert('🌱 Standards Compliance', message);
  };

  // Enhanced data calculation with CO₂e support
  const calculateDisplayData = () => {
    console.log('🔄 Calculating enhanced display data...');
    
    // Priority 1: Use CSR summary if available
    if (csrSummary && csrSummary.total_impact_score > 0) {
      console.log('✅ Using enhanced CSR summary data');
      const totalImpacts = csrSummary.total_impacts || impactData.length;
      const averageScore = totalImpacts > 0 ? Math.round(csrSummary.total_impact_score / totalImpacts) : 0;
      
      return {
        averageScore,
        totalCO2: csrSummary.total_co2_saved || 0,
        totalCO2e: csrSummary.total_co2e_saved || csrSummary.total_co2_saved || 0,
        totalWater: csrSummary.total_water_saved || 0,
        totalWaste: csrSummary.total_waste_diverted || 0,
        totalSocial: csrSummary.total_social_value || 0,
        totalImpacts,
        impactLevel: csrSummary.impact_level || getOverallImpactLevel(averageScore),
        complianceStandards: csrSummary.compliance_standards || ['GHG Protocol', 'ISO 14040', 'UNEP Circular Economy']
      };
    } 
    
    // Priority 2: Calculate from impact data
    const impactDataWithScores = impactData.filter(item => item.impact_score > 0);
    if (impactDataWithScores.length > 0) {
      console.log('📊 Calculating from impact data with CO₂e');
      const totalImpactScore = impactDataWithScores.reduce((sum, item) => sum + (item.impact_score || 0), 0);
      const averageScore = Math.round(totalImpactScore / impactDataWithScores.length);
      
      return {
        averageScore,
        totalCO2: impactDataWithScores.reduce((sum, item) => sum + (item.co2_saved_kg || 0), 0),
        totalCO2e: impactDataWithScores.reduce((sum, item) => sum + (item.co2e_saved_kg || item.co2_saved_kg || 0), 0),
        totalWater: impactDataWithScores.reduce((sum, item) => sum + (item.water_saved_l || 0), 0),
        totalWaste: impactDataWithScores.reduce((sum, item) => sum + (item.waste_diverted_kg || 0), 0),
        totalSocial: impactDataWithScores.reduce((sum, item) => sum + (item.social_value || 0), 0),
        totalImpacts: impactDataWithScores.length,
        impactLevel: getOverallImpactLevel(averageScore),
        complianceStandards: ['GHG Protocol', 'ISO 14040', 'UNEP Circular Economy']
      };
    }
    
    // No valid data available
    return {
      averageScore: 0,
      totalCO2: 0,
      totalCO2e: 0,
      totalWater: 0,
      totalWaste: 0,
      totalSocial: 0,
      totalImpacts: 0,
      impactLevel: "Getting Started 🚀",
      complianceStandards: ['GHG Protocol', 'ISO 14040', 'UNEP Circular Economy']
    };
  };

  const displayData = calculateDisplayData();

  // Backend status indicator
  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return 'Backend: Connected ✓';
      case 'error': return 'Backend: Local Mode 🔄';
      default: return 'Backend: Checking...';
    }
  };

  const scoreColor = getScoreColor(displayData.averageScore);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Impact Dashboard</Text>

        {/* Enhanced Backend Status with Standards Info */}
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          <Text style={styles.statusUrl}>API: {Config.API_BASE_URL}</Text>
          
          {/* Standards Compliance Badge */}
          <TouchableOpacity onPress={showStandardsInfo} style={styles.standardsBadge}>
            <Text style={styles.standardsBadgeText}>🌍 Standards Compliant</Text>
          </TouchableOpacity>

          {backendStatus === 'error' && (
            <View style={styles.retryContainer}>
              <TouchableOpacity onPress={retryBackendConnection} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry Connection</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={testImpactCalculation} style={styles.testButton}>
                <Text style={styles.testText}>Test Backend</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Calculating impact score...</Text>
            <Text style={styles.loadingSubtext}>Using international standards compliance</Text>
          </View>
        )}

        {/* Enhanced Impact Score Card */}
        <View style={[styles.scoreContainer, { backgroundColor: scoreColor }]}>
          <Text style={styles.scoreTitle}>Overall Impact Score</Text>
          <Text style={styles.scoreValue}>{displayData.averageScore}</Text>
          <Text style={styles.scoreLevel}>{displayData.impactLevel}</Text>
          <Text style={styles.scoreSubtitle}>Based on {displayData.totalImpacts} impacts</Text>
          
          {/* Carbon Accounting Note */}
          <View style={styles.carbonNote}>
            <Text style={styles.carbonNoteText}>🌱 Using CO₂e (Includes all greenhouse gases)</Text>
          </View>
          
          {displayData.totalImpacts === 0 && (
            <Text style={styles.scoreHint}>Add your first impact to see your score!</Text>
          )}
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(100, (displayData.averageScore / 600) * 100)}%`,
                    backgroundColor: scoreColor
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Progress to Champion: {Math.min(100, Math.round((displayData.averageScore / 600) * 100))}%
            </Text>
          </View>
        </View>

        {/* Enhanced Key Metrics with CO₂e */}
        <View style={styles.metricsRow}>
          <ImpactCard 
            title="CO₂e Saved" 
            value={displayData.totalCO2e.toFixed(2)} 
            unit="kg"
            color="#4CAF50"
            subtitle="All greenhouse gases"
            icon="🌱"
            info="Carbon Dioxide Equivalent - includes CO₂, methane, etc."
          />
          <ImpactCard 
            title="Water Saved" 
            value={displayData.totalWater.toFixed(2)} 
            unit="L"
            color="#2196F3"
            subtitle="Water conservation"
            icon="💧"
          />
        </View>
        
        <View style={styles.metricsRow}>
          <ImpactCard 
            title="Waste Diverted" 
            value={displayData.totalWaste.toFixed(2)} 
            unit="kg"
            color="#FF9800"
            subtitle="Waste reduction"
            icon="🗑️"
          />
          <ImpactCard 
            title="Social Value" 
            value={displayData.totalSocial.toFixed(2)} 
            unit="points"
            color="#9C27B0"
            subtitle="Community impact"
            icon="❤️"
          />
        </View>

        {/* Standards Compliance Section */}
        <View style={styles.standardsContainer}>
          <Text style={styles.sectionTitle}>🌍 Standards Compliance</Text>
          <Text style={styles.standardsSubtitle}>International Environmental Accounting</Text>
          
          <View style={styles.standardsGrid}>
            <View style={styles.standardItem}>
              <Text style={styles.standardIcon}>📊</Text>
              <Text style={styles.standardName}>GHG Protocol</Text>
              <Text style={styles.standardDesc}>Carbon accounting</Text>
            </View>
            <View style={styles.standardItem}>
              <Text style={styles.standardIcon}>🔬</Text>
              <Text style={styles.standardName}>ISO 14040</Text>
              <Text style={styles.standardDesc}>Life Cycle Assessment</Text>
            </View>
            <View style={styles.standardItem}>
              <Text style={styles.standardIcon}>🔄</Text>
              <Text style={styles.standardName}>UNEP Circular</Text>
              <Text style={styles.standardDesc}>Circular economy</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={showStandardsInfo} style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn about standards</Text>
          </TouchableOpacity>
        </View>

        {/* Category Performance */}
        <View style={styles.categoryPerformance}>
          <Text style={styles.sectionTitle}>Category Performance</Text>
          {impactData.length > 0 && (
            <View style={styles.categoryList}>
              {Object.entries(
                impactData.reduce((acc, item) => {
                  const category = item.category;
                  if (!acc[category]) {
                    acc[category] = { count: 0, totalScore: 0, avgScore: 0, totalCO2e: 0 };
                  }
                  acc[category].count += 1;
                  acc[category].totalScore += item.impact_score || 0;
                  acc[category].totalCO2e += item.co2e_saved_kg || item.co2_saved_kg || 0;
                  acc[category].avgScore = acc[category].totalScore / acc[category].count;
                  return acc;
                }, {})
              )
              .sort((a, b) => b[1].avgScore - a[1].avgScore)
              .map(([category, data]) => (
                <View key={category} style={styles.categoryItem}>
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) }]}>
                    <Text style={styles.categoryIconText}>
                      {category === 'Food' ? '🍎' : 
                       category === 'Electronics' ? '💻' : 
                       category === 'Clothes' ? '👕' : 
                       category === 'Furniture' ? '🪑' : '📚'}
                    </Text>
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryStats}>
                      {data.count} items • Avg: {Math.round(data.avgScore)} pts
                    </Text>
                    <Text style={styles.categoryCO2e}>
                      CO₂e: {data.totalCO2e.toFixed(1)}kg
                    </Text>
                  </View>
                  <View style={styles.categoryScore}>
                    <Text style={styles.categoryScoreText}>{Math.round(data.avgScore)}</Text>
                    <Text style={styles.categoryScoreLabel}>avg</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Enhanced Quick Add with standards info */}
        <View style={styles.quickAddContainer}>
          <Text style={styles.sectionTitle}>Quick Add Impact</Text>
          <Text style={styles.quickAddSubtitle}>Common items with standards-compliant scoring</Text>
          
          <View style={styles.standardsNote}>
            <Text style={styles.standardsNoteText}>
              🎯 All calculations follow GHG Protocol, ISO 14040, and UNEP Circular Economy standards
            </Text>
          </View>
          
          <View style={styles.quickAddButtons}>
            <TouchableOpacity 
              style={[styles.quickAddButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => {
                setNewTransaction({
                  category: 'Food',
                  quantity_kg: '1',
                  distance_km: '0',
                  description: 'Food waste reduction - GHG Protocol compliant'
                });
                setShowAddForm(true);
              }}
            >
              <Text style={styles.quickAddText}>🍎 Food (1kg)</Text>
              <Text style={styles.quickAddPoints}>~80-120 pts</Text>
              <Text style={styles.quickAddCO2e}>CO₂e: ~2.2kg</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAddButton, { backgroundColor: '#2196F3' }]}
              onPress={() => {
                setNewTransaction({
                  category: 'Electronics',
                  quantity_kg: '1',
                  distance_km: '0',
                  description: 'E-waste reduction - ISO 14040 LCA'
                });
                setShowAddForm(true);
              }}
            >
              <Text style={styles.quickAddText}>💻 Electronics (1kg)</Text>
              <Text style={styles.quickAddPoints}>~150-220 pts</Text>
              <Text style={styles.quickAddCO2e}>CO₂e: ~5.2kg</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickAddButtons}>
            <TouchableOpacity 
              style={[styles.quickAddButton, { backgroundColor: '#FF9800' }]}
              onPress={() => {
                setNewTransaction({
                  category: 'Clothes',
                  quantity_kg: '2',
                  distance_km: '0',
                  description: 'Clothing donation - Circular economy'
                });
                setShowAddForm(true);
              }}
            >
              <Text style={styles.quickAddText}>👕 Clothes (2kg)</Text>
              <Text style={styles.quickAddPoints}>~100-160 pts</Text>
              <Text style={styles.quickAddCO2e}>CO₂e: ~7.6kg</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAddButton, { backgroundColor: '#9C27B0' }]}
              onPress={() => {
                setNewTransaction({
                  category: 'Furniture',
                  quantity_kg: '5',
                  distance_km: '0',
                  description: 'Furniture reuse - Lifecycle assessment'
                });
                setShowAddForm(true);
              }}
            >
              <Text style={styles.quickAddText}>🪑 Furniture (5kg)</Text>
              <Text style={styles.quickAddPoints}>~180-280 pts</Text>
              <Text style={styles.quickAddCO2e}>CO₂e: ~20.5kg</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent High Scores */}
        {impactData.length > 0 && (
          <View style={styles.highScoresContainer}>
            <Text style={styles.sectionTitle}>Top Impact Scores ⭐</Text>
            <Text style={styles.sectionSubtitle}>Best performing items with standards-compliant scoring</Text>
            {impactData
              .filter(item => item.impact_score > 0)
              .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
              .slice(0, 3)
              .map((item, index) => (
                <View key={item.transaction_id || index} style={styles.scoreItem}>
                  <View style={[
                    styles.scoreRank,
                    { backgroundColor: getScoreColor(item.impact_score) }
                  ]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.scoreDetails}>
                    <View style={styles.scoreHeader}>
                      <Text style={styles.scoreCategory}>{item.category}</Text>
                      <Text style={styles.scorePoints}>{item.impact_score} points</Text>
                    </View>
                    <Text style={styles.itemScoreLevel}>{item.impact_level}</Text>
                    <Text style={styles.scoreDescription}>{item.description || 'No description'}</Text>
                    <Text style={styles.scoreMetrics}>
                      CO₂e: {item.co2e_saved_kg || item.co2_saved_kg}kg • Water: {item.water_saved_l}L • Waste: {item.waste_diverted_kg}kg
                    </Text>
                  </View>
                </View>
              ))}
            {impactData.filter(item => item.impact_score > 0).length === 0 && (
              <Text style={styles.noScoresText}>No impact scores yet. Add new impacts to see scores!</Text>
            )}
          </View>
        )}

        {/* Add Impact Manually */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Cancel' : '+ Add Custom Impact'}
          </Text>
        </TouchableOpacity>

        {/* Enhanced form with standards information */}
        {showAddForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Impact</Text>
            <Text style={styles.formSubtitle}>Standards-compliant environmental accounting</Text>
            
            <View style={styles.standardsInfoBox}>
              <Text style={styles.standardsInfoTitle}>🌍 Standards Applied:</Text>
              <Text style={styles.standardsInfoText}>• GHG Protocol (CO₂e calculation)</Text>
              <Text style={styles.standardsInfoText}>• ISO 14040 (Life Cycle Assessment)</Text>
              <Text style={styles.standardsInfoText}>• UNEP Circular Economy Principles</Text>
            </View>
            
            <Text style={styles.inputLabel}>Quantity (kg)*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity in kilograms"
              value={newTransaction.quantity_kg}
              onChangeText={(text) => setNewTransaction({...newTransaction, quantity_kg: text})}
              keyboardType="numeric"
              editable={!loading}
            />
            
            <Text style={styles.inputLabel}>Description (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief description of the item"
              value={newTransaction.description}
              onChangeText={(text) => setNewTransaction({...newTransaction, description: text})}
              editable={!loading}
            />
            
            <Text style={styles.categoryLabel}>Select Category:</Text>
            <View style={styles.categoryContainer}>
              {['Food', 'Clothes', 'Electronics', 'Furniture', 'Books'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newTransaction.category === category && styles.categoryButtonActive,
                    { borderColor: getCategoryColor(category) }
                  ]}
                  onPress={() => setNewTransaction({...newTransaction, category})}
                  disabled={loading}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    newTransaction.category === category && styles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleAddImpact}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Calculating with Standards...' : 'Calculate & Save Impact'}
              </Text>
            </TouchableOpacity>

            <View style={styles.scoringInfo}>
              <Text style={styles.scoringTitle}>🎯 Enhanced Scoring System:</Text>
              <Text style={styles.scoringText}>• CO₂e calculation (all greenhouse gases)</Text>
              <Text style={styles.scoringText}>• GHG Protocol Scope 3 compliance</Text>
              <Text style={styles.scoringText}>• ISO 14040 Life Cycle Assessment</Text>
              <Text style={styles.scoringText}>• Circular economy principles applied</Text>
              <Text style={styles.scoringText}>• Professional CSR reporting ready</Text>
            </View>
          </View>
        )}

        {/* Enhanced debug tools */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Developer & Standards Tools</Text>
          <Text style={styles.debugText}>
            Records: {impactData.length} | CO₂e: {displayData.totalCO2e.toFixed(1)}kg | Level: {displayData.impactLevel}
          </Text>
          <View style={styles.debugButtons}>
            <TouchableOpacity onPress={showStandardsInfo} style={styles.debugButton}>
              <Text style={styles.debugButtonText}>Standards Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={testImpactCalculation} style={styles.debugButton}>
              <Text style={styles.debugButtonText}>Test Backend</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={validateDataConsistency} style={styles.debugButton}>
              <Text style={styles.debugButtonText}>Validate Data</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Floating CSR Report Button */}
      <Animated.View style={[styles.floatingButton]}>
        <TouchableOpacity 
          style={styles.floatingButtonInner}
          onPress={() => setShowCSRModal(true)}
        >
          <Text style={styles.floatingButtonText}>📊 CSR Report</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* CSR Report Modal */}
      <Modal
        visible={showCSRModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCSRModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>CSR Impact Report</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCSRModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <CSRReportScreen csrData={csrSummary} impactData={impactData} />
        </View>
      </Modal>
    </View>
  );
};

// ADDED BACK: Missing styles
const styles = StyleSheet.create({
  // ... (all the previous styles remain the same)
  highScoresContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scoreRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  scoreCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scorePoints: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  itemScoreLevel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  scoreMetrics: {
    fontSize: 10,
    color: '#999',
  },
  noScoresText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  statusContainer: {
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusUrl: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  standardsBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  standardsBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  retryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF9800',
    borderRadius: 4,
  },
  testText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLevel: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  carbonNote: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  carbonNoteText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  loadingSubtext: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  standardsContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  standardsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  standardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  standardItem: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
  },
  standardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  standardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  standardDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  learnMoreButton: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryPerformance: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryStats: {
    fontSize: 12,
    color: '#666',
  },
  categoryCO2e: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoryScore: {
    alignItems: 'center',
  },
  categoryScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryScoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  quickAddContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAddSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  standardsNote: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  standardsNoteText: {
    fontSize: 11,
    color: '#1565C0',
    fontWeight: '500',
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickAddButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickAddText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickAddPoints: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    marginTop: 2,
  },
  quickAddCO2e: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    marginTop: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  standardsInfoBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  standardsInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  standardsInfoText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 12,
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoringInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  scoringTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  scoringText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  debugContainer: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  debugButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  debugButton: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    minWidth: 100,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    zIndex: 1000,
  },
  floatingButtonInner: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  // ... (rest of the styles remain the same)
});

export default ImpactDashboard;