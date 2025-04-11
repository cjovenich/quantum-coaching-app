import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function DailyPriming() {
  const router = useRouter();
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
    // Load saved name from storage
    const loadName = async () => {
      const savedName = await SecureStore.getItemAsync('userName');
      if (savedName) setName(savedName);
    };
    loadName();

    // Pick random quote
    setQuote(sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)]);
  }, []);

  useEffect(() => {
    let timer;
    if (started && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [started, seconds]);

  const startBreathing = () => {
    setStarted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good morning, {name} 👋</Text>
      <Text style={styles.date}>Today is {day}, {date}</Text>
      <Text style={styles.time}>It’s currently {time}</Text>

      <Text style={styles.quote}>“{quote}”</Text>

      {started ? (
        <Text style={styles.timer}>🧘‍♂️ {seconds} seconds of breathing...</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={startBreathing}>
          <Text style={styles.buttonText}>Start 1-Minute Breathing</Text>
        </TouchableOpacity>
      )}

      {seconds === 0 && (
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() => router.push('/(tabs)')} // Replace this with /dashboard or /habit-tracker later
        >
          <Text style={styles.buttonText}>Continue to Next Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'
  },
  greeting: {
    fontSize: 24, color: '#00ffe0', fontWeight: 'bold', marginBottom: 10
  },
  date: {
    fontSize: 16, color: '#ccc', marginBottom: 5
  },
  time: {
    fontSize: 16, color: '#ccc', marginBottom: 20
  },
  quote: {
    fontStyle: 'italic', color: '#eee', textAlign: 'center', marginBottom: 30, fontSize: 16
  },
  timer: {
    fontSize: 28, color: '#00ffe0', fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#00ffe0', padding: 15, borderRadius: 10
  },
  buttonText: {
    color: '#000', fontWeight: 'bold'
  }
});
