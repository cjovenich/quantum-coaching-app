import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme'; // ✅ assumes your theme file supports light/dark mode

export default function AudioGraphScreen() {
  const colorScheme = useColorScheme();
  const activeTheme = theme[colorScheme || 'dark'];

  const [chartData, setChartData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: []
  });

  useEffect(() => {
    const load = async () => {
      const logs = await AsyncStorage.getItem('audio_learning_log');
      const parsed = logs ? JSON.parse(logs) : {};
      const keys = Object.keys(parsed).sort();

      const recent = keys.slice(-7); // last 7 days
      const labels = recent.map(k => k.slice(5)); // MM-DD
      const data = recent.map(k => Math.floor((parsed[k] || 0) / 60)); // convert to minutes

      setChartData({ labels, data });
    };
    load();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
      <Text style={[styles.title, { color: activeTheme.colors.primary }]}>🎧 Listening Trends</Text>
      <Text style={[styles.subtitle, { color: activeTheme.colors.text }]}>Your last 7 days of audio learning</Text>

      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [{ data: chartData.data }]
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisSuffix="m"
        yAxisInterval={10}
        chartConfig={{
          backgroundGradientFrom: activeTheme.colors.background,
          backgroundGradientTo: activeTheme.colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 255, 224, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: activeTheme.colors.primary
          }
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20
  }
});
