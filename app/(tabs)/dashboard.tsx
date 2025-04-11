import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function Dashboard() {
  const [habitStreaks, setHabitStreaks] = useState({});
  const [calendarData, setCalendarData] = useState({});
  const [progress, setProgress] = useState({
    mind: 0,
    body: 0,
    focus: 0,
    consistency: 0,
  });

  const mindHabits = ['Meditate', 'Journal', 'Read'];
  const bodyHabits = ['Drink Water', 'Stretch', 'Walk'];
  const focusHabits = ['Deep Work', 'Plan Day', 'Avoid Distractions'];

  useEffect(() => {
    const loadData = async () => {
      const streaks = await AsyncStorage.getItem('habit_streaks');
      const calendar = await AsyncStorage.getItem('calendar_log');
      setHabitStreaks(streaks ? JSON.parse(streaks) : {});
      setCalendarData(calendar ? JSON.parse(calendar) : {});
    };
    loadData();
  }, []);

  useEffect(() => {
    const totalDays = Object.keys(calendarData).length;
    const consistency = Math.min((totalDays / 30) * 100, 100);

    const streakAvg = (types) => {
      const scores = types.map(h => habitStreaks[h] || 0);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return Math.min(avg * 3, 100); // scale 0–33 into ~0–100
    };

    setProgress({
      mind: streakAvg(mindHabits),
      body: streakAvg(bodyHabits),
      focus: streakAvg(focusHabits),
      consistency,
    });
  }, [habitStreaks, calendarData]);

  const categories = [
    { label: 'Mind', value: progress.mind, color: '#00ffe0' },
    { label: 'Body', value: progress.body, color: '#ff6f00' },
    { label: 'Focus', value: progress.focus, color: '#7c4dff' },
    { label: 'Consistency', value: progress.consistency, color: '#00c853' }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 Quantum Dashboard</Text>
      <Text style={styles.sub}>Your current personal progress</Text>

      <View style={styles.grid}>
        {categories.map((cat, index) => (
          <View key={index} style={styles.ringContainer}>
            <CircularProgress
              value={Math.round(cat.value)}
              radius={60}
              duration={1200}
              activeStrokeColor={cat.color}
              inActiveStrokeColor="#1e1e1e"
              inActiveStrokeWidth={10}
              activeStrokeWidth={12}
              title={`${cat.label}`}
              titleColor="#ccc"
              titleStyle={{ fontWeight: 'bold', fontSize: 14 }}
              valueSuffix="%"
              progressValueColor="#fff"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0a0a0a',
    flexGrow: 1
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00ffe0',
    marginBottom: 10
  },
  sub: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  ringContainer: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center'
  }
});
