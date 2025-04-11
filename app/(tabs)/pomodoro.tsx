import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const breakAudio = require('../assets/audio/breaktime.mp3');
const workAudio = require('../assets/audio/backtowork.mp3');

export default function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            clearInterval(intervalRef.current);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
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
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧠 Pomodoro Timer</Text>
      <Text style={styles.sub}>{mode === 'focus' ? 'Focus Session' : 'Break Time'}</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setIsRunning(!isRunning)}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#00ffe0', marginBottom: 10 },
  sub: { fontSize: 18, color: '#ccc', marginBottom: 30 },
  timer: { fontSize: 64, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
  controls: { flexDirection: 'row' },
  button: { backgroundColor: '#00ffe0', padding: 15, borderRadius: 10, marginHorizontal: 10 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
