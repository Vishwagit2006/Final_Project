import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  PieChart,
  BarChart,
  LineChart
} from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const ImpactChart = ({ data, type = 'pie' }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>No impact data available</Text>
      </View>
    );
  }

  // Prepare data for charts
  const categoryData = data.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += item.co2_saved_kg || 0;
    return acc;
  }, {});

  // Pie Chart Data
  const pieData = Object.entries(categoryData).map(([name, value], index) => ({
    name,
    value: Math.round(value),
    color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'][index % 5],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // Bar Chart Data
  const barData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData).map(val => Math.round(val)),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  if (type === 'pie') {
    return (
      <View style={styles.container}>
        <Text style={styles.chartTitle}>Impact by Category</Text>
        <PieChart
          data={pieData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>CO₂ Savings by Category</Text>
      <BarChart
        data={barData}
        width={width - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix="kg"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
});

export default ImpactChart;