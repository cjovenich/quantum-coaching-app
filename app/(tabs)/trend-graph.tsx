import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function TrendGraphScreen() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { data: [], color: () => '#00ffe0', strokeWidth: 2 }, // Mind
      { data: [], color: () => '#ff6f00', strokeWidth: 2 }, // Body
      { data: [], color: () => '#7c4dff', strokeWidth: 2 }, // Focus
      { data: [], color: () => '#00c853', strokeWidth: 2 }, // Consistency
    ],
    legend: ['Mind', 'Body', 'Focus', 'Consistency'],
  });

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    generateTrend();
  }, []);

  const generateTrend = async () => {
    const habitStreaks = JSON.parse(await AsyncStorage.getItem('habit_streaks') || '{}');
    const calendarLog = JSON.parse(await AsyncStorage.getItem('calendar_log') || '{}');

    const mindHabits = ['Meditate', 'Journal', 'Read', 'Gratitude Journal'];
    const bodyHabits = ['Drink Water', 'Stretch', 'Walk', 'Sleep Tracking'];
    const focusHabits = ['Plan Day', 'Deep Work', 'Reflect on the Day'];

    const today = new Date();
    const labels = [];
    const mind = [], body = [], focus = [], consistency = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(key.slice(5)); // MM-DD

      const habitsToday = calendarLog[key] || [];
      const score = (group) => {
        const match = habitsToday.filter(h => group.includes(h)).length;
        return group.length ? (match / group.length) * 100 : 0;
      };

      mind.push(score(mindHabits));
      body.push(score(bodyHabits));
      focus.push(score(focusHabits));
      consistency.push(habitsToday.length ? 100 : 0);
    }

    setChartData({
      labels,
      datasets: [
        { data: mind, color: () => '#00ffe0', strokeWidth: 2 },
        { data: body, color: () => '#ff6f00', strokeWidth: 2 },
        { data: focus, color: () => '#7c4dff', strokeWidth: 2 },
        { data: consistency, color: () => '#00c853', strokeWidth: 2 },
      ],
      legend: ['Mind', 'Body', 'Focus', 'Consistency'],
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#00ffe0' : '#007acc' }]}>📈 Progress Trend</Text>
      <Text style={[styles.subtitle, { color: isDark ? '#aaa' : '#666' }]}>
        Your last 7 days of consistency and growth
      </Text>

      <LineChart
        data={chartData}
        width={screenWidth - 30}
        height={280}
        chartConfig={{
          backgroundGradientFrom: isDark ? '#0a0a0a' : '#fff',
          backgroundGradientTo: isDark ? '#0a0a0a' : '#fff',
          color: () => isDark ? '#fff' : '#000',
          labelColor: () => isDark ? '#aaa' : '#333',
          propsForDots: {
            r: '4',
            strokeWidth: '1',
            stroke: isDark ? '#fff' : '#000',
          }
        }}
        bezier
        style={{ marginTop: 20, borderRadius: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20
  }
});
