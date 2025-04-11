import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function AudioLearningScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
            handleCompletionCelebration(); // 🔥 Plays both sounds
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
    const save = async () => {
      const logs = await AsyncStorage.getItem('audio_learning_log');
      const parsed = logs ? JSON.parse(logs) : {};
      parsed[todayKey] = seconds;
      await AsyncStorage.setItem('audio_learning_log', JSON.stringify(parsed));
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
      // ✅ Success sound
      const { sound: successSound } = await Audio.Sound.createAsync(
        require('../../assets/success.mp3')
      );
      await successSound.playAsync();

      // ✅ Motivational voice
      const { sound: voiceSound } = await Audio.Sound.createAsync(
        require('../../assets/audio/youcrushit.mp3') // Adjust path if needed
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
    <View style={styles.container}>
      <Text style={styles.title}>🎧 Audio Learning</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTimer}>
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>

      {completed && (
        <Text style={styles.complete}>✅ 1 hour goal completed! Badge unlocked 🎉</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20
  },
  title: {
    fontSize: 28, fontWeight: 'bold', color: '#00ffe0', marginBottom: 20
  },
  timer: {
    fontSize: 48, color: '#fff', marginBottom: 40
  },
  button: {
    backgroundColor: '#00ffe0', padding: 15, borderRadius: 10, width: 200, alignItems: 'center'
  },
  buttonText: {
    fontSize: 18, fontWeight: 'bold'
  },
  resetButton: {
    marginTop: 15
  },
  resetText: {
    color: '#aaa'
  },
  complete: {
    marginTop: 20, fontSize: 16, color: '#00ff88', fontWeight: 'bold'
  }
});
