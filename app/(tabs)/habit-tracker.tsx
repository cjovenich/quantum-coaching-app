// FULL MERGED VERSION — Audio Learning + all your features
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Audio } from 'expo-av';
import { fetchUserData, saveUserData } from './sync';

const presetHabits = ['Drink Water', 'Meditate', 'Stretch', '🎧 Audio Learning (1h)'];

export default function HabitTracker() {
  const [habits, setHabits] = useState<string[]>([]);
  const [customHabit, setCustomHabit] = useState('');
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [habitStreaks, setHabitStreaks] = useState<Record<string, number>>({});
  const [badges, setBadges] = useState<string[]>([]);
  const [calendarData, setCalendarData] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      const data = await fetchUserData();
      setHabits(data.habits || presetHabits);
      setCompletedToday(data.completed_today || {});
      setHabitStreaks(data.habit_streaks || {});
      setBadges(data.unlocked_badges || []);
      setCalendarData(data.calendar_log || {});
    };
    load();
  }, []);

  useEffect(() => {
    const time = new Date().getHours();
    const lowerHabits = habits.map(h => h.toLowerCase());

    const possibleSuggestions = [
      time < 11 && !lowerHabits.includes('make bed') && 'Make Bed',
      time < 12 && !lowerHabits.includes('plan day') && 'Plan Day',
      time >= 12 && time < 17 && !lowerHabits.includes('walk') && 'Afternoon Walk',
      time >= 20 && !lowerHabits.includes('reflect') && 'Reflect on the Day',
      !lowerHabits.includes('gratitude') && 'Gratitude Journal',
      !lowerHabits.includes('sleep tracking') && 'Sleep Tracking'
    ].filter(Boolean);

    setSuggestions(possibleSuggestions.slice(0, 3));
  }, [habits]);

  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/success.mp3')
    );
    await sound.playAsync();
  };

  const speak = (msg: string) => Speech.speak(msg);

  const unlockBadge = (id: string) => {
    if (!badges.includes(id)) {
      const updated = [...badges, id];
      setBadges(updated);
    }
  };

  const saveAll = async (
    updatedCompleted = completedToday,
    updatedStreaks = habitStreaks,
    updatedCalendar = calendarData,
    updatedBadges = badges
  ) => {
    const data = {
      habits,
      habit_streaks: updatedStreaks,
      completed_today: updatedCompleted,
      calendar_log: updatedCalendar,
      unlocked_badges: updatedBadges
    };
    await saveUserData(data);
  };

  const toggleHabit = async (habit: string) => {
    const newCompleted = { ...completedToday, [habit]: !completedToday[habit] };
    const newStreaks = { ...habitStreaks };
    const newCalendar = { ...calendarData };
    let newBadges = [...badges];

    if (newCompleted[habit]) {
      newStreaks[habit] = (newStreaks[habit] || 0) + 1;

      if (newStreaks[habit] === 1) unlockBadge('first_time');
      if (newStreaks[habit] === 3) { unlockBadge('stick_streak'); speak('Good job!'); }
      if (newStreaks[habit] === 7) { unlockBadge('weekly_champion'); speak('You’re a weekly champion!'); }
      if (newStreaks[habit] === 30) { unlockBadge('beast_mode'); speak('You’ve activated BEAST MODE!'); }
    }

    const totalCompleted = Object.values(newCompleted).filter(Boolean).length;
    if (totalCompleted === habits.length) {
      unlockBadge('habit_hero');
      unlockBadge('daily_master');
      speak('Congratulations, you made a quantum leap.');
      newCalendar[todayKey] = [...habits];
    }

    setCompletedToday(newCompleted);
    setHabitStreaks(newStreaks);
    setCalendarData(newCalendar);
    setBadges(newBadges);

    await saveAll(newCompleted, newStreaks, newCalendar, newBadges);
    await playSuccessSound();
  };

  const addHabit = async () => {
    if (customHabit.trim() === '') return;
    const updated = [...habits, customHabit.trim()];
    setHabits(updated);
    setCustomHabit('');
    await saveAll();
  };

  const removeHabit = async (habitToRemove: string) => {
    const updated = habits.filter(h => h !== habitToRemove);
    const updatedCompleted = { ...completedToday };
    const updatedStreaks = { ...habitStreaks };
    delete updatedCompleted[habitToRemove];
    delete updatedStreaks[habitToRemove];

    setHabits(updated);
    setCompletedToday(updatedCompleted);
    setHabitStreaks(updatedStreaks);

    await saveAll(updatedCompleted, updatedStreaks, calendarData, badges);
  };

  const markedDates = Object.keys(calendarData).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#00ffe0' };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Habit Tracker</Text>

      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setModalVisible(true);
        }}
        theme={{
          calendarBackground: '#0a0a0a',
          dayTextColor: '#fff',
          monthTextColor: '#00ffe0',
          arrowColor: '#00ffe0',
          textDisabledColor: '#333',
        }}
      />

      <FlatList
        data={habits}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.habit, completedToday[item] && styles.completed]}
            onPress={() => toggleHabit(item)}
            onLongPress={() =>
              Alert.alert('Remove Habit?', item, [
                { text: 'Cancel' },
                { text: 'Remove', onPress: () => removeHabit(item), style: 'destructive' }
              ])
            }
          >
            <Ionicons
              name={completedToday[item] ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={completedToday[item] ? '#00ffe0' : '#aaa'}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.habitText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={customHabit}
          onChangeText={setCustomHabit}
          placeholder="Add a new habit"
          placeholderTextColor="#777"
        />
        <TouchableOpacity onPress={addHabit} style={styles.addButton}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* 💡 Suggestions */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ color: '#aaa', fontSize: 16, marginBottom: 10 }}>
          💡 Suggestions:
        </Text>

        {suggestions.map((habit, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.suggestionCard}
            onPress={() => {
              const updated = [...habits, habit];
              setHabits(updated);
              setSuggestions(suggestions.filter(s => s !== habit));
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#00ffe0" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff' }}>{habit}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Completed on {selectedDate}</Text>
            {calendarData[selectedDate]?.length > 0 ? (
              calendarData[selectedDate].map((habit, idx) => (
                <Text key={idx} style={styles.modalItem}>• {habit}</Text>
              ))
            ) : (
              <Text style={styles.modalItem}>No data logged.</Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: '#000' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00ffe0', marginBottom: 20 },
  habit: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 10
  },
  completed: { backgroundColor: '#003f3f' },
  habitText: { color: '#fff', fontSize: 16 },
  addRow: { flexDirection: 'row', marginTop: 20 },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10
  },
  addButton: { backgroundColor: '#00ffe0', padding: 10, borderRadius: 10 },
  addText: { color: '#000', fontWeight: 'bold' },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#00ffe0', marginBottom: 10
  },
  modalItem: { color: '#ccc', fontSize: 14, marginBottom: 5 },
  closeBtn: { marginTop: 15, padding: 10, backgroundColor: '#00ffe0', borderRadius: 10 }
});
