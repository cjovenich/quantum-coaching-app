import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { theme } from '../theme'; // Adjust path as needed

export default function AudioLearningScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scheme = useColorScheme();
  const activeTheme = theme[scheme || 'dark'];

  const goalInSeconds = 60 * 60;
  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      const logs = await AsyncStorage.getItem('audio_learning_log');
      const parsed = logs ? JSON.parse(logs) : {};
      const saved = parsed[todayKey] || 0;
      setSeconds(saved);
      if (saved >= goalInSeconds) setCompleted(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const updated = prev + 1;
          if (updated >= goalInSeconds && !completed) {
            setCompleted(true);
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            handleCompletionCelebration();
          }
          return updated;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (seconds % 10 !== 0) return;

    const save = async () => {
      const logs = await AsyncStorage.getItem('audio_learning_log');
      const parsed = logs ? JSON.parse(logs) : {};
      parsed[todayKey] = seconds;
      await AsyncStorage.setItem('audio_learning_log', JSON.stringify(parsed));

      const allSeconds = Object.values(parsed).reduce((sum, val) => sum + val, 0);
      const totalHours = allSeconds / 3600;
      const unlocked = await AsyncStorage.getItem('audio_learning_badges');
      const currentBadges = unlocked ? JSON.parse(unlocked) : [];

      if (totalHours >= 7 && !currentBadges.includes('book_beast')) {
        currentBadges.push('book_beast');
      }
      if (totalHours >= 30 && !currentBadges.includes('master_listener')) {
        currentBadges.push('master_listener');
      }

      await AsyncStorage.setItem('audio_learning_badges', JSON.stringify(currentBadges));
    };

    save();
  }, [seconds]);

  const toggleTimer = () => {
    if (completed) return;
    setIsRunning((prev) => !prev);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(0);
    setIsRunning(false);
    setCompleted(false);
  };

  const handleCompletionCelebration = async () => {
    try {
      const { sound: successSound } = await Audio.Sound.createAsync(
        require('../../assets/success.mp3')
      );
      await successSound.playAsync();

      const { sound: voiceSound } = await Audio.Sound.createAsync(
        require('../../assets/audio/youcrushit.mp3')
      );
      await voiceSound.playAsync();
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${sec}s`;
  };

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
      <Text style={[styles.title, { color: activeTheme.colors.primary }]}>🎧 Audio Learning</Text>
      <Text style={[styles.timer, { color: activeTheme.colors.text }]}>{formatTime(seconds)}</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: activeTheme.colors.primary }]} onPress={toggleTimer}>
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={[styles.resetText, { color: activeTheme.colors.text }]}>Reset</Text>
      </TouchableOpacity>

      {completed && (
        <Text style={[styles.complete, { color: '#00ff88' }]}>
          ✅ 1 hour goal completed! Badge unlocked 🎉
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 20
  },
  timer: {
    fontSize: 48, marginBottom: 40
  },
  button: {
    padding: 15, borderRadius: 10, width: 200, alignItems: 'center'
  },
  buttonText: {
    fontSize: 18, fontWeight: 'bold', color: '#000'
  },
  resetButton: {
    marginTop: 15
  },
  resetText: {
    fontSize: 14
  },
  complete: {
    marginTop: 20, fontSize: 16, fontWeight: 'bold'
  }
});
