import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome to Quantum Coaching</Text>
      <Text style={styles.subtitle}>Explore your performance, habits, and progress.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/daily-priming')}>
        <Text style={styles.buttonText}>Start Daily Priming</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 30
  },
  title: {
    fontSize: 26, fontWeight: 'bold', color: '#00ffe0', marginBottom: 10
  },
  subtitle: {
    fontSize: 16, color: '#ccc', marginBottom: 30, textAlign: 'center'
  },
  button: {
    backgroundColor: '#00ffe0', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10
  },
  buttonText: {
    color: '#000', fontSize: 16, fontWeight: 'bold'
  }
});
