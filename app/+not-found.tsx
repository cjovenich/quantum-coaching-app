import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <LottieView
        source={require('../assets/animations/void-404.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={[styles.message, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
        You've stumbled into the void—just don't stare too long, or it might stare back.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>🚀 Return Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30
  },
  animation: {
    width: 250,
    height: 250,
    marginBottom: 30
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30
  },
  button: {
    backgroundColor: '#00ffe0',
    padding: 14,
    borderRadius: 10
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000'
  }
});
