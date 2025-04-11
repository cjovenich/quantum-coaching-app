import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const badgeData = [
  {
    id: 'habit_hero',
    title: 'Habit Hero',
    description: 'Completed all habits in one day',
    icon: require('../assets/badges/7.png'),
  },
  {
    id: 'first_time',
    title: 'First Completion',
    description: 'Completed a habit for the first time',
    icon: require('../assets/badges/5.png'),
  },
  {
    id: 'recovery',
    title: 'Comeback Ninja',
    description: 'Completed a habit you missed yesterday',
    icon: require('../assets/badges/6.png'),
  },
  {
    id: 'stick_streak',
    title: 'Stick Streak',
    description: 'Completed a habit 3 days in a row',
    icon: require('../assets/badges/1.png'),
  },
  {
    id: 'weekly_champion',
    title: 'Weekly Champion',
    description: 'Completed a habit 7 days in a row',
    icon: require('../assets/badges/2.png'),
  },
  {
    id: 'beast_mode',
    title: 'Beast Mode Activated!',
    description: '30-day streak on a single habit',
    icon: require('../assets/badges/3.png'),
  },
  {
    id: 'daily_master',
    title: 'Daily Master',
    description: 'Completed all habits today (again!)',
    icon: require('../assets/badges/4.png'),
  }
];

export default function RewardsScreen() {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const stored = await AsyncStorage.getItem('unlocked_badges');
        if (stored) {
          setUnlockedBadges(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load badges:', err);
      }
    };
    fetchBadges();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🥷 Achievements</Text>
      <Text style={styles.sub}>You earn badges for consistency, recovery, and beast mode.</Text>

      <View style={styles.grid}>
        {badgeData.map((badge, index) => {
          const unlocked = unlockedBadges.includes(badge.id);
          return (
            <Animated.View key={badge.id} entering={FadeInUp.delay(index * 100)} style={[styles.card, !unlocked && styles.locked]}>
              {unlocked ? (
                <Image source={badge.icon} style={styles.icon} />
              ) : (
                <Ionicons name="lock-closed-outline" size={48} color="#666" />
              )}
              <Text style={styles.title}>{badge.title}</Text>
              <Text style={styles.desc}>{badge.description}</Text>
            </Animated.View>
          );
        })}
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
  card: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20
  },
  locked: {
    opacity: 0.4
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 10
  },
  title: {
    color: '#00ffe0',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center'
  },
  desc: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center'
  }
});
