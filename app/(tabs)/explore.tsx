import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function Explore() {
  const router = useRouter();

  const exploreItems = [
    {
      title: 'New Habit Ideas',
      description: 'Explore curated routines to boost productivity, health, and mindfulness.',
      icon: 'bulb-outline',
      action: () => router.push('/habit-tracker')
    },
    {
      title: 'Weekly Challenge',
      description: 'Join this week’s challenge: 10,000 steps a day. Track your streak!',
      icon: 'flame-outline',
      action: () => alert('Challenge coming soon!')
    },
    {
      title: 'Unlock Achievements',
      description: 'View your progress and earn badges for consistency.',
      icon: 'trophy-outline',
      action: () => router.push('/rewards')
    },
    {
      title: 'Guided Priming',
      description: 'Try a new 3-minute breathing session with motivational voiceovers.',
      icon: 'medkit-outline',
      action: () => router.push('/daily-priming')
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🌌 Welcome to Explore</Text>
      <Text style={styles.sub}>Discover new features, challenges, and routines.</Text>

      {exploreItems.map((item, index) => (
        <Animated.View key={index} entering={FadeInUp.delay(index * 100)} style={styles.card}>
          <TouchableOpacity onPress={item.action}>
            <View style={styles.cardRow}>
              <Ionicons name={item.icon} size={28} color="#00ffe0" style={{ marginRight: 15 }} />
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
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
  card: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardTitle: {
    color: '#00ffe0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  cardDescription: {
    color: '#ccc',
    fontSize: 14
  }
});
