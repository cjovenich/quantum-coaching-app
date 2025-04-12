import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/404-space.json')} // 👈 Replace with your animation
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.message}>
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
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  animation: {
    width: Dimensions.get('window').width * 0.9,
    height: 250,
    marginBottom: 30
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40
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
