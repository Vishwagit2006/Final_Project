import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Share,
  Dimensions 
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';

// Perfect Color Grading
const CSR_COLORS = {
  primary: '#1A6B54',
  primaryLight: '#2D957A',
  primarySoft: '#E8F5F0',
  secondary: '#4A90E2',
  secondarySoft: '#EBF2FF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  accentGold: '#D97706',
  accentEmerald: '#059669',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  muted: '#CBD5E1',
};

const CSR_GRADIENTS = {
  header: ['#1A6B54', '#2D957A'],
  primary: ['#1A6B54', '#38B2AC'],
  secondary: ['#4A90E2', '#60A5FA'],
  gold: ['#D97706', '#F59E0B'],
  silver: ['#6B7280', '#9CA3AF'],  
  bronze: ['#92400E', '#B45309'],
  soft: ['#F8FAFC', '#F1F5F9'],
  card: ['#FFFFFF', '#F8FAFC'],
  champion: ['#059669', '#10B981'],
  warrior: ['#1A6B54', '#2D957A'],
  guardian: ['#2D957A', '#38B2AC'],
  protector: ['#4A90E2', '#60A5FA'],
  beginner: ['#CBD5E1', '#E2E8F0'],
  starter: ['#F1F5F9', '#F8FAFC'],
};

const getCategoryColor = (category) => {
  const categoryColors = {
    'Food': '#059669',
    'Clothes': '#0EA5E9',  
    'Electronics': '#D97706',
    'Furniture': '#7C3AED',
    'Books': '#DC2626',
    'Other': '#6B7280',
  };
  return categoryColors[category] || CSR_COLORS.primary;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CSRReportScreen = ({ csrData, impactData }) => {
  const [loading, setLoading] = useState(false);

  // Calculate metrics
  const calculateMetrics = () => {
    if (!impactData?.length) {
      return {
        totalImpacts: 0,
        totalImpactScore: 0,
        averageImpactScore: 0,
        totalCO2: 0,
        totalCO2e: 0,
        totalWater: 0,
        totalWaste: 0,
        totalSocial: 0
      };
    }

    const totalImpactScore = impactData.reduce((sum, item) => sum + (item.impact_score || 0), 0);
    const totalImpacts = impactData.length;
    const averageImpactScore = totalImpacts > 0 ? Math.round(totalImpactScore / totalImpacts) : 0;

    return {
      totalImpacts,
      totalImpactScore,
      averageImpactScore,
      totalCO2: impactData.reduce((sum, item) => sum + (item.co2_saved_kg || 0), 0),
      totalCO2e: impactData.reduce((sum, item) => sum + (item.co2e_saved_kg || item.co2_saved_kg || 0), 0),
      totalWater: impactData.reduce((sum, item) => sum + (item.water_saved_l || 0), 0),
      totalWaste: impactData.reduce((sum, item) => sum + (item.waste_diverted_kg || 0), 0),
      totalSocial: impactData.reduce((sum, item) => sum + (item.social_value || 0), 0)
    };
  };

  const metrics = calculateMetrics();

  const getImpactLevel = (score) => {
    if (score >= 800) return { title: 'Environmental Champion', icon: '🌟', gradient: CSR_GRADIENTS.champion };
    if (score >= 600) return { title: 'Eco Warrior', icon: '🦸‍♂️', gradient: CSR_GRADIENTS.warrior };
    if (score >= 400) return { title: 'Green Guardian', icon: '🌿', gradient: CSR_GRADIENTS.guardian };
    if (score >= 200) return { title: 'Planet Protector', icon: '🌎', gradient: CSR_GRADIENTS.protector };
    if (score >= 100) return { title: 'Eco Beginner', icon: '🌱', gradient: CSR_GRADIENTS.beginner };
    return { title: 'Getting Started', icon: '🚀', gradient: CSR_GRADIENTS.starter };
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    impactData?.forEach(item => {
      const category = item.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
  };

  const categoryBreakdown = getCategoryBreakdown();

  // OPTIMIZED PDF GENERATION - CSR IMPACT REPORT ONLY
  const generatePDF = async () => {
    setLoading(true);
    try {
      const htmlContent = generateHTMLContent();
      
      // Generate PDF with optimized settings
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
        width: 612, // US Letter width in points
        height: 792, // US Letter height in points
        margins: {
          left: 36,
          top: 36,
          right: 36,
          bottom: 36
        }
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'CSR Impact Report',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('Success', `CSR Impact Report PDF saved to: ${uri}`);
      }
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert('Error', 'Failed to generate CSR Impact Report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareReport = async () => {
    const impactLevel = getImpactLevel(metrics.averageImpactScore);
    const message = `
🌍 CSR Impact Report

${impactLevel.icon} ${impactLevel.title}
📊 Score: ${metrics.averageImpactScore}/1000

Environmental Impact:
🌱 CO₂e: ${metrics.totalCO2e.toFixed(1)}kg
💧 Water: ${metrics.totalWater.toFixed(0)}L
🗑️ Waste: ${metrics.totalWaste.toFixed(1)}kg
❤️ Social: ${metrics.totalSocial.toFixed(0)}

Total: ${metrics.totalImpacts} impacts
Generated on ${new Date().toLocaleDateString()}
    `.trim();

    await Share.share({ message, title: 'CSR Impact Report' });
  };

  // COMPREHENSIVE HTML CONTENT FOR PDF - CSR IMPACT REPORT ONLY
  const generateHTMLContent = () => {
    const impactLevel = getImpactLevel(metrics.averageImpactScore);
    const topAchievements = impactData
      .filter(item => item.impact_score > 0)
      .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
      .slice(0, 5);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CSR Impact Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1E293B;
            background: white;
            padding: 0;
          }
          
          .report-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          
          /* Header Section */
          .header {
            background: linear-gradient(135deg, ${CSR_COLORS.primary}, ${CSR_COLORS.primaryLight});
            color: white;
            padding: 50px 40px;
            text-align: center;
            border-bottom: 1px solid #E2E8F0;
          }
          
          .header h1 {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }
          
          .header p {
            font-size: 18px;
            opacity: 0.95;
            margin-bottom: 30px;
            font-weight: 500;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0 0 0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .stat-card {
            background: rgba(255,255,255,0.25);
            padding: 20px;
            border-radius: 16px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
          }
          
          .stat-value {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 6px;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.95;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          
          /* Performance Section */
          .performance-section {
            padding: 50px 40px;
            background: linear-gradient(135deg, ${impactLevel.gradient[0]}, ${impactLevel.gradient[1]});
            color: white;
            text-align: center;
          }
          
          .performance-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          
          .performance-score {
            font-size: 72px;
            font-weight: 800;
            margin-bottom: 12px;
            line-height: 1;
          }
          
          .performance-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          
          .performance-subtitle {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
          }
          
          /* Metrics Section */
          .metrics-section {
            padding: 50px 40px;
            background: ${CSR_COLORS.background};
          }
          
          .section-title {
            font-size: 28px;
            font-weight: 700;
            color: ${CSR_COLORS.primary};
            margin-bottom: 30px;
            text-align: center;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
          }
          
          .metric-card {
            background: white;
            padding: 30px 20px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid ${CSR_COLORS.border};
          }
          
          .metric-icon {
            font-size: 32px;
            margin-bottom: 16px;
          }
          
          .metric-value {
            font-size: 32px;
            font-weight: 800;
            color: ${CSR_COLORS.primary};
            margin-bottom: 8px;
          }
          
          .metric-label {
            font-size: 14px;
            color: ${CSR_COLORS.textSecondary};
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          
          .metric-unit {
            font-size: 12px;
            color: ${CSR_COLORS.textTertiary};
            margin-top: 4px;
          }
          
          /* Categories Section */
          .categories-section {
            padding: 50px 40px;
            background: white;
          }
          
          .category-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-width: 500px;
            margin: 0 auto;
          }
          
          .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: ${CSR_COLORS.primarySoft};
            border-radius: 12px;
            border-left: 4px solid ${CSR_COLORS.primary};
          }
          
          .category-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          
          .category-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
          }
          
          .category-name {
            font-size: 18px;
            font-weight: 600;
            color: ${CSR_COLORS.textPrimary};
          }
          
          .category-count {
            background: ${CSR_COLORS.primary};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
          }
          
          /* Achievements Section */
          .achievements-section {
            padding: 50px 40px;
            background: ${CSR_COLORS.background};
          }
          
          .achievement-card {
            background: white;
            padding: 25px;
            border-radius: 16px;
            margin-bottom: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-left: 4px solid ${CSR_COLORS.accentGold};
          }
          
          .achievement-category {
            font-size: 20px;
            font-weight: 700;
            color: ${CSR_COLORS.primary};
            margin-bottom: 8px;
          }
          
          .achievement-score {
            font-size: 16px;
            font-weight: 600;
            color: ${CSR_COLORS.textSecondary};
          }
          
          /* Footer */
          .footer {
            text-align: center;
            padding: 40px;
            color: ${CSR_COLORS.textSecondary};
            font-size: 14px;
            border-top: 1px solid ${CSR_COLORS.border};
            background: white;
          }
          
          .logo {
            text-align: center;
            margin-bottom: 10px;
            font-size: 24px;
            font-weight: 800;
            color: ${CSR_COLORS.primary};
          }
          
          .report-date {
            font-size: 16px;
            color: ${CSR_COLORS.textSecondary};
            margin-bottom: 20px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- Header -->
          <div class="header">
            <div class="logo">🌍 Recircle</div>
            <h1>CSR Impact Report</h1>
            <p>Comprehensive Environmental Performance Analysis</p>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${metrics.totalImpacts}</div>
                <div class="stat-label">Total Impacts</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${metrics.totalImpactScore}</div>
                <div class="stat-label">Total Points</div>
              </div>
            </div>
          </div>
          
          <!-- Performance Overview -->
          <div class="performance-section">
            <div class="performance-icon">${impactLevel.icon}</div>
            <div class="performance-score">${metrics.averageImpactScore}</div>
            <div class="performance-title">${impactLevel.title}</div>
            <div class="performance-subtitle">
              Average performance score from ${metrics.totalImpacts} environmental impact contributions
            </div>
          </div>
          
          <!-- Environmental Metrics -->
          <div class="metrics-section">
            <div class="section-title">Environmental Impact Metrics</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-icon">🌱</div>
                <div class="metric-value">${metrics.totalCO2e.toFixed(1)}</div>
                <div class="metric-label">CO₂e Saved</div>
                <div class="metric-unit">kilograms</div>
              </div>
              <div class="metric-card">
                <div class="metric-icon">💧</div>
                <div class="metric-value">${metrics.totalWater.toFixed(0)}</div>
                <div class="metric-label">Water Saved</div>
                <div class="metric-unit">liters</div>
              </div>
              <div class="metric-card">
                <div class="metric-icon">🗑️</div>
                <div class="metric-value">${metrics.totalWaste.toFixed(1)}</div>
                <div class="metric-label">Waste Diverted</div>
                <div class="metric-unit">kilograms</div>
              </div>
              <div class="metric-card">
                <div class="metric-icon">❤️</div>
                <div class="metric-value">${metrics.totalSocial.toFixed(0)}</div>
                <div class="metric-label">Social Value</div>
                <div class="metric-unit">points</div>
              </div>
            </div>
          </div>
          
          <!-- Category Breakdown -->
          <div class="categories-section">
            <div class="section-title">Impact Distribution by Category</div>
            <div class="category-list">
              ${Object.entries(categoryBreakdown).map(([category, count]) => `
                <div class="category-item">
                  <div class="category-left">
                    <div class="category-dot" style="background: ${getCategoryColor(category)}"></div>
                    <div class="category-name">${category}</div>
                  </div>
                  <div class="category-count">${count} impacts</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Top Achievements -->
          ${topAchievements.length > 0 ? `
          <div class="achievements-section">
            <div class="section-title">Top Environmental Achievements</div>
            ${topAchievements.map((item, index) => {
              const itemLevel = getImpactLevel(item.impact_score);
              return `
                <div class="achievement-card">
                  <div class="achievement-category">${item.category}</div>
                  <div class="achievement-score">
                    ${item.impact_score} points • ${itemLevel.title} ${itemLevel.icon}
                  </div>
                  <div style="margin-top: 8px; font-size: 14px; color: #64748B;">
                    CO₂e: ${(item.co2e_saved_kg || item.co2_saved_kg || 0).toFixed(1)}kg • 
                    Water: ${(item.water_saved_l || 0).toFixed(0)}L • 
                    Waste: ${(item.waste_diverted_kg || 0).toFixed(1)}kg
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ` : ''}
          
          <!-- Footer -->
          <div class="footer">
            <div class="report-date">
              Generated on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div>Recircle Corporate Social Responsibility Analytics</div>
            <div style="margin-top: 8px; font-size: 12px; color: #94A3B8;">
              Committed to sustainable environmental practices and circular economy principles
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (!impactData?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>No Data Available</Text>
        <Text style={styles.emptyText}>
          Start tracking environmental impacts to generate CSR reports
        </Text>
      </View>
    );
  }

  const impactLevel = getImpactLevel(metrics.averageImpactScore);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient colors={CSR_GRADIENTS.header} style={styles.header}>
        <Text style={styles.headerTitle}>CSR Impact Report</Text>
        <Text style={styles.headerSubtitle}>Environmental Performance Analysis</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{metrics.totalImpacts}</Text>
            <Text style={styles.statLabel}>Total Impacts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{metrics.totalImpactScore}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Performance Card */}
      <View style={styles.section}>
        <LinearGradient colors={impactLevel.gradient} style={styles.performanceCard}>
          <Text style={styles.performanceIcon}>{impactLevel.icon}</Text>
          <Text style={styles.performanceScore}>{metrics.averageImpactScore}</Text>
          <Text style={styles.performanceTitle}>{impactLevel.title}</Text>
          <Text style={styles.performanceSubtitle}>
            Average from {metrics.totalImpacts} environmental impacts
          </Text>
        </LinearGradient>
      </View>

      {/* Metrics Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="🌱"
            value={`${metrics.totalCO2e.toFixed(1)}`}
            label="CO₂e Saved"
            unit="kg"
            colors={CSR_GRADIENTS.soft}
          />
          <MetricCard
            icon="💧"
            value={`${metrics.totalWater.toFixed(0)}`}
            label="Water Saved"
            unit="liters"
            colors={CSR_GRADIENTS.soft}
          />
          <MetricCard
            icon="🗑️"
            value={`${metrics.totalWaste.toFixed(1)}`}
            label="Waste Diverted"
            unit="kg"
            colors={CSR_GRADIENTS.soft}
          />
          <MetricCard
            icon="❤️"
            value={`${metrics.totalSocial.toFixed(0)}`}
            label="Social Value"
            unit="points"
            colors={CSR_GRADIENTS.soft}
          />
        </View>
      </View>

      {/* Category Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Impact by Category</Text>
        <View style={styles.categoryList}>
          {Object.entries(categoryBreakdown).map(([category, count], index) => (
            <CategoryItem
              key={category}
              category={category}
              count={count}
              index={index}
            />
          ))}
        </View>
      </View>

      {/* Top Achievements */}
      {impactData.filter(item => item.impact_score > 0).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Achievements</Text>
          {impactData
            .filter(item => item.impact_score > 0)
            .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
            .slice(0, 3)
            .map((item, index) => (
              <AchievementCard
                key={index}
                item={item}
                index={index}
                impactLevel={getImpactLevel(item.impact_score)}
              />
            ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <ActionButton
          icon="📄"
          title={loading ? "Generating CSR Report..." : "Generate CSR Report PDF"}
          onPress={generatePDF}
          loading={loading}
          primary
        />
        <ActionButton
          icon="📤"
          title="Share Summary"
          onPress={shareReport}
          primary={false}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
    </ScrollView>
  );
};

// Reusable Components (same as before)
const MetricCard = ({ icon, value, label, unit, colors }) => (
  <LinearGradient colors={colors} style={styles.metricCard}>
    <Text style={styles.metricIcon}>{icon}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricUnit}>{unit}</Text>
  </LinearGradient>
);

const CategoryItem = ({ category, count, index }) => (
  <View style={styles.categoryItem}>
    <View style={styles.categoryLeft}>
      <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
      <Text style={styles.categoryName}>{category}</Text>
    </View>
    <View style={[styles.categoryCount, { backgroundColor: getCategoryColor(category) }]}>
      <Text style={styles.categoryCountText}>{count}</Text>
    </View>
  </View>
);

const AchievementCard = ({ item, index, impactLevel }) => {
  const rankColors = [
    CSR_GRADIENTS.gold,
    CSR_GRADIENTS.silver,  
    CSR_GRADIENTS.bronze
  ];

  return (
    <LinearGradient colors={rankColors[index] || CSR_GRADIENTS.soft} style={styles.achievementCard}>
      <View style={[styles.rankBadge, { backgroundColor: impactLevel.gradient[0] }]}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementCategory}>{item.category}</Text>
        <Text style={styles.achievementScore}>{item.impact_score} points</Text>
        <Text style={styles.achievementLevel}>{impactLevel.title}</Text>
      </View>
    </LinearGradient>
  );
};

const ActionButton = ({ icon, title, onPress, loading, primary }) => (
  <TouchableOpacity
    style={[styles.actionButton, primary ? styles.primaryButton : styles.secondaryButton]}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color={primary ? '#FFF' : CSR_COLORS.primary} />
    ) : (
      <>
        <Text style={styles.buttonIcon}>{icon}</Text>
        <Text style={[styles.buttonText, primary && styles.primaryButtonText]}>
          {title}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

// Styles remain the same as your original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CSR_COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    color: CSR_COLORS.primary,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: CSR_COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: CSR_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: CSR_COLORS.textPrimary,
    marginBottom: 16,
    paddingLeft: 4,
  },
  performanceCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  performanceIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  performanceScore: {
    fontSize: 48,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  performanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  performanceSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  metricCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: CSR_COLORS.textPrimary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: CSR_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricUnit: {
    fontSize: 11,
    color: CSR_COLORS.textSecondary,
    marginTop: 2,
  },
  categoryList: {
    backgroundColor: CSR_COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: CSR_COLORS.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: CSR_COLORS.textPrimary,
  },
  categoryCount: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rankText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  achievementContent: {
    flex: 1,
  },
  achievementCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: CSR_COLORS.textPrimary,
    marginBottom: 4,
  },
  achievementScore: {
    fontSize: 14,
    fontWeight: '600',
    color: CSR_COLORS.primary,
    marginBottom: 2,
  },
  achievementLevel: {
    fontSize: 12,
    color: CSR_COLORS.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: CSR_COLORS.primary,
    shadowColor: CSR_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: CSR_COLORS.surface,
    borderWidth: 2,
    borderColor: CSR_COLORS.primary,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: CSR_COLORS.primary,
  },
  primaryButtonText: {
    color: 'white',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: CSR_COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default CSRReportScreen;