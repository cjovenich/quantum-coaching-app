import React from 'react';
import { View, ScrollView } from 'react-native';
import EmotionTracker from '../components/EmotionTracker';
import MoodRing from '../components/MoodRing';
import MoodRing from '../components/MoodRing_TrendChart';

<MoodRing emotions={yourEmotionData} />

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getEmotionHistory } from '../sync';

export const TodayMoodBadge = () => {
  const [todayMood, setTodayMood] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().split('T')[0];
      const moods = await getEmotionHistory();
      setTodayMood(moods[today] || null);
    };
    fetch();
  }, []);

  if (!todayMood) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.label}>🌈 Today’s Mood:</Text>
      <Text style={styles.mood}>{todayMood}</Text>
      {/* If using icons: <Image source={require(`../assets/Emotions/${todayMood}.png`)} style={{ width: 40, height: 40 }} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  label: { color: '#aaa', fontSize: 14 },
  mood: { fontSize: 22, fontWeight: 'bold', color: '#00ffe0', marginTop: 6 },
});

// Example emotion tracking data (you can later replace with dynamic state or backend)
const emotions = [
  { date: '2025-04-15', mood: 'Happy' },
  { date: '2025-04-16', mood: 'Inspired' },
  // Add more historical mood entries as needed
];

export default function Dashboard() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Emotion selection calendar + mood icons */}
        <EmotionTracker />

        {/* Mood Ring visualization using emotion history */}
        <MoodRing emotions={emotions} />
      </View>

      {/* Add any additional dashboard components here */}
    </ScrollView>
  );
}
