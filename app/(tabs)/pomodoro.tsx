import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { Audio } from 'expo-av';

const breakAudio = require('../assets/audio/breaktime.mp3');
const workAudio = require('../assets/audio/backtowork.mp3');

export default function PomodoroTimer() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleSessionEnd = async () => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setSecondsLeft(nextMode === 'focus' ? 25 * 60 : 5 * 60);
    setIsRunning(false);

    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(nextMode === 'focus' ? workAudio : breakAudio);
      await sound.playAsync();
    } catch (error) {
      console.warn('⚠️ Audio playback error:', error);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧠 Pomodoro Timer</Text>
      <Text style={styles.sub}>{mode === 'focus' ? 'Focus Session' : 'Break Time'}</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setIsRunning((prev) => !prev)}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#0a0a0a' : '#f2f2f2',
      padding: 20
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      color: darkMode ? '#00ffe0' : '#0077cc',
      marginBottom: 10
    },
    sub: {
      fontSize: 18,
      color: darkMode ? '#ccc' : '#555',
      marginBottom: 30
    },
    timer: {
      fontSize: 64,
      fontWeight: 'bold',
      color: darkMode ? '#fff' : '#000',
      marginBottom: 40
    },
    controls: {
      flexDirection: 'row'
    },
    button: {
      backgroundColor: darkMode ? '#00ffe0' : '#0077cc',
      padding: 15,
      borderRadius: 10,
      marginHorizontal: 10
    },
    buttonText: {
      color: darkMode ? '#000' : '#fff',
      fontWeight: 'bold',
      fontSize: 16
    }
  });
