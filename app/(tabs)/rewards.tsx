import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';

const badgeData = [
  {
    id: 'habit_hero',
    title: 'Habit Hero',
    description: 'Completed all habits in one day',
    icon: require('../../assets/badges/7.png'),
  },
  {
    id: 'first_time',
    title: 'First Completion',
    description: 'Completed a habit for the first time',
    icon: require('../../assets/badges/5.png'),
  },
  {
    id: 'recovery',
    title: 'Comeback Ninja',
    description: 'Completed a habit you missed yesterday',
    icon: require('../../assets/badges/6.png'),
  },
  {
    id: 'stick_streak',
    title: 'Stick Streak',
    description: 'Completed a habit 3 days in a row',
    icon: require('../../assets/badges/1.png'),
  },
  {
    id: 'weekly_champion',
    title: 'Weekly Champion',
    description: 'Completed a habit 7 days in a row',
    icon: require('../../assets/badges/2.png'),
  },
  {
    id: 'beast_mode',
    title: 'Beast Mode Activated!',
    description: '30-day streak on a single habit',
    icon: require('../../assets/badges/3.png'),
  },
  {
    id: 'daily_master',
    title: 'Daily Master',
    description: 'Completed all habits today (again!)',
    icon: require('../../assets/badges/4.png'),
  }
];

export default function RewardsScreen() {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const stored = await AsyncStorage.getItem('unlocked_badges');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUnlockedBadges(parsed);
          setNewlyUnlocked(true);
          playSound();
        }
      } catch (err) {
        console.error('Failed to load badges:', err);
      }
    };
    fetchBadges();
  }, []);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/success.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  const dynamic = {
    background: isDark ? '#0a0a0a' : '#fff',
    card: isDark ? '#1e1e1e' : '#f2f2f2',
    title: isDark ? '#00ffe0' : '#007acc',
    subtitle: isDark ? '#aaa' : '#666',
    text: isDark ? '#fff' : '#111'
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: dynamic.background }]}>
      <Text style={[styles.header, { color: dynamic.title }]}>🥷 Achievements</Text>
      <Text style={[styles.sub, { color: dynamic.subtitle }]}>
        You earn badges for consistency, recovery, and beast mode.
      </Text>

      {newlyUnlocked && (
        <ConfettiCannon
          count={80}
          origin={{ x: 200, y: -20 }}
          fadeOut
          explosionSpeed={400}
        />
      )}

      <View style={styles.grid}>
        {badgeData.map((badge, index) => {
          const unlocked = unlockedBadges.includes(badge.id);
          return (
            <Animated.View
              key={badge.id}
              entering={FadeInUp.delay(index * 100)}
              style={[
                styles.card,
                { backgroundColor: dynamic.card },
                !unlocked && styles.locked
              ]}
            >
              {unlocked ? (
                <Image source={badge.icon} style={styles.icon} />
              ) : (
                <Ionicons name="lock-closed-outline" size={48} color="#666" />
              )}
              <Text style={[styles.title, { color: dynamic.title }]}>{badge.title}</Text>
              <Text style={[styles.desc, { color: dynamic.subtitle }]}>{badge.description}</Text>
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
    flexGrow: 1
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10
  },
  sub: {
    fontSize: 16,
    marginBottom: 30
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
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
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center'
  },
  desc: {
    fontSize: 12,
    textAlign: 'center'
  }
});
