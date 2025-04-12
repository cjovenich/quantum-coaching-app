import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { theme } from '../theme'; // adjust if your theme path is different

export default function DailyPriming() {
  const router = useRouter();
  const scheme = useColorScheme();
  const activeTheme = theme[scheme || 'dark'];

  const [seconds, setSeconds] = useState(60);
  const [started, setStarted] = useState(false);
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('Friend');

  const today = new Date();
  const day = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sampleQuotes = [
    "The best way to predict the future is to create it.",
    "Small habits make a big difference.",
    "You are what you do consistently, not occasionally.",
    "Discipline is freedom.",
    "You don’t need motivation. You need momentum."
  ];

  useEffect(() => {
    const loadName = async () => {
      const savedName = await SecureStore.getItemAsync('userName');
      if (savedName) setName(savedName);
    };
    loadName();

    setQuote(sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)]);
  }, []);

  useEffect(() => {
    let timer;
    if (started && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [started, seconds]);

  const startBreathing = () => setStarted(true);

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
      <Text style={[styles.greeting, { color: activeTheme.colors.primary }]}>
        Good morning, {name} 👋
      </Text>
      <Text style={[styles.date, { color: activeTheme.colors.text }]}>
        Today is {day}, {date}
      </Text>
      <Text style={[styles.time, { color: activeTheme.colors.text }]}>
        It’s currently {time}
      </Text>

      <Text style={[styles.quote, { color: activeTheme.colors.text }]}>“{quote}”</Text>

      {started ? (
        <Text style={[styles.timer, { color: activeTheme.colors.primary }]}>
          🧘‍♂️ {seconds} seconds of breathing...
        </Text>
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: activeTheme.colors.primary }]} onPress={startBreathing}>
          <Text style={styles.buttonText}>Start 1-Minute Breathing</Text>
        </TouchableOpacity>
      )}

      {seconds === 0 && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: activeTheme.colors.primary, marginTop: 20 }]}
          onPress={() => router.push('/(tabs)/habit-tracker')}
        >
          <Text style={styles.buttonText}>Continue to Next Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center'
  },
  greeting: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10
  },
  date: {
    fontSize: 16, marginBottom: 5
  },
  time: {
    fontSize: 16, marginBottom: 20
  },
  quote: {
    fontStyle: 'italic', textAlign: 'center', marginBottom: 30, fontSize: 16
  },
  timer: {
    fontSize: 28, fontWeight: 'bold'
  },
  button: {
    padding: 15, borderRadius: 10
  },
  buttonText: {
    fontWeight: 'bold', color: '#000'
  }
});
