import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const handleReturnHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' },
      ]}
    >
      <Image
  source={require('../assets/animations/404-space.png')}  // 👈 RIGHT HERE
  style={styles.image}
  resizeMode="contain"
/>
      
      <Text
        style={[
          styles.message,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
        ]}
      >
        You've stumbled into the void—just don't stare too long, or it might
        stare back.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleReturnHome}>
        <Text style={styles.buttonText}>🚀 Return Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00ffe0',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
