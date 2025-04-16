import React, { useEffect, useState, useCallback, useMemo, useReducer } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Animated, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import { fetchUserData, saveUserData } from '../sync';
import { suggestHabits } from '../utils/suggestHabits';
import EmotionTracker from '../components/EmotionTracker';
import MoodRing from '../components/MoodRing';

const presetHabits = ['Drink Water', 'Meditate', 'Stretch', '🎧 Audio Learning (1h)'];

const initialState = {
  habits: [],
  completedToday: {},
  habitStreaks: {},
  badges: [],
  calendarData: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_HABITS': return { ...state, habits: action.payload };
    case 'SET_COMPLETED_TODAY': return { ...state, completedToday: action.payload };
    case 'SET_HABIT_STREAKS': return { ...state, habitStreaks: action.payload };
    case 'SET_BADGES': return { ...state, badges: action.payload };
    case 'SET_CALENDAR_DATA': return { ...state, calendarData: action.payload };
    default: return state;
  }
}

export default function HabitTracker() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [customHabit, setCustomHabit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserData();
        dispatch({ type: 'SET_HABITS', payload: data.habits || presetHabits });
        dispatch({ type: 'SET_COMPLETED_TODAY', payload: data.completed_today || {} });
        dispatch({ type: 'SET_HABIT_STREAKS', payload: data.habit_streaks || {} });
        dispatch({ type: 'SET_BADGES', payload: data.unlocked_badges || [] });
        dispatch({ type: 'SET_CALENDAR_DATA', payload: data.calendar_log || {} });
      } catch (err) {
        Alert.alert('Error', 'Failed to load user data. Please try again.');
      }
    };
    load();
  }, []);

  useEffect(() => {
    const time = new Date().getHours();
    const lower = state.habits.map(h => h.toLowerCase());
    const emotionSuggestions = suggestHabits(selectedEmotion);

    const timeBasedSuggestions = [
      time < 11 && !lower.includes('make bed') && 'Make Bed',
      time < 12 && !lower.includes('plan day') && 'Plan Day',
      time >= 12 && time < 17 && !lower.includes('walk') && 'Afternoon Walk',
      time >= 20 && !lower.includes('reflect') && 'Reflect on Day',
      !lower.includes('gratitude') && 'Gratitude Journal',
      !lower.includes('sleep tracking') && 'Sleep Tracking'
    ].filter(Boolean);

    setSuggestions([...new Set([...emotionSuggestions, ...timeBasedSuggestions])].slice(0, 5));
  }, [state.habits, selectedEmotion]);

  const playSuccessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/success.mp3'));
      await sound.playAsync();
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  const speak = (msg: string) => Speech.speak(msg);

  const unlockBadge = (id: string) => {
    if (!state.badges.includes(id)) {
      const updated = [...state.badges, id];
      dispatch({ type: 'SET_BADGES', payload: updated });
    }
  };

  const saveAll = async (
    updatedCompleted = state.completedToday,
    updatedStreaks = state.habitStreaks,
    updatedCalendar = state.calendarData,
    updatedBadges = state.badges
  ) => {
    const payload = {
      habits: state.habits,
      habit_streaks: updatedStreaks,
      completed_today: updatedCompleted,
      calendar_log: updatedCalendar,
      unlocked_badges: updatedBadges
    };
    try {
      await saveUserData(payload);
    } catch (e) {
      Alert.alert('Save error', 'Failed to save progress.');
    }
  };

  const toggleHabit = useCallback(async (habit: string) => {
    const completed = { ...state.completedToday, [habit]: !state.completedToday[habit] };
    const streaks = { ...state.habitStreaks };
    const calendar = { ...state.calendarData };
    const badges = [...state.badges];

    if (completed[habit]) {
      streaks[habit] = (streaks[habit] || 0) + 1;
      if (streaks[habit] === 1) unlockBadge('first_time');
      if (streaks[habit] === 3) { unlockBadge('stick_streak'); speak('Good job!'); }
      if (streaks[habit] === 7) { unlockBadge('weekly_champion'); speak('You’re a weekly champion!'); }
      if (streaks[habit] === 30) { unlockBadge('beast_mode'); speak('You’ve activated BEAST MODE!'); }
    }

    const completedAll = Object.values(completed).filter(Boolean).length === state.habits.length;
    if (completedAll) {
      unlockBadge('habit_hero');
      unlockBadge('daily_master');
      speak('Congratulations, you made a quantum leap.');
      calendar[todayKey] = [...state.habits];
    }

    dispatch({ type: 'SET_COMPLETED_TODAY', payload: completed });
    dispatch({ type: 'SET_HABIT_STREAKS', payload: streaks });
    dispatch({ type: 'SET_CALENDAR_DATA', payload: calendar });
    dispatch({ type: 'SET_BADGES', payload: badges });

    await saveAll(completed, streaks, calendar, badges);
    await playSuccessSound();
  }, [state]);

  const addHabit = debounce(async () => {
    const habit = customHabit.trim();
    if (!habit || state.habits.includes(habit)) return;
    const updated = [...state.habits, habit];
    dispatch({ type: 'SET_HABITS', payload: updated });
    setCustomHabit('');
    await saveAll();
  }, 300);

  const removeHabit = useCallback(async (habit: string) => {
    const updated = state.habits.filter(h => h !== habit);
    const completed = { ...state.completedToday };
    const streaks = { ...state.habitStreaks };
    delete completed[habit];
    delete streaks[habit];

    dispatch({ type: 'SET_HABITS', payload: updated });
    dispatch({ type: 'SET_COMPLETED_TODAY', payload: completed });
    dispatch({ type: 'SET_HABIT_STREAKS', payload: streaks });

    await saveAll(completed, streaks);
  }, [state]);

  const markedDates = useMemo(() => {
    return Object.keys(state.calendarData).reduce((acc, date) => {
      acc[date] = { marked: true, dotColor: '#00ffe0' };
      return acc;
    }, {});
  }, [state.calendarData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧠 Habit Tracker</Text>
      <EmotionTracker />
      <MoodRing />

      <Calendar
        markedDates={markedDates}
        onDayPress={({ dateString }) => {
          setSelectedDate(dateString);
          setModalVisible(true);
        }}
        theme={{
          calendarBackground: '#0a0a0a',
          dayTextColor: '#fff',
          monthTextColor: '#00ffe0',
          arrowColor: '#00ffe0',
          textDisabledColor: '#333'
        }}
      />

      <FlatList
        data={state.habits}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.habit, state.completedToday[item] && styles.completed]}
            onPress={() => toggleHabit(item)}
            onLongPress={() =>
              Alert.alert('Remove?', item, [
                { text: 'Cancel' },
                { text: 'Remove', onPress: () => removeHabit(item), style: 'destructive' }
              ])
            }
          >
            <Ionicons
              name={state.completedToday[item] ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={state.completedToday[item] ? '#00ffe0' : '#aaa'}
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Completed on {selectedDate}</Text>
            {state.calendarData[selectedDate]?.length > 0 ? (
              state.calendarData[selectedDate].map((h, i) => (
                <Text key={i} style={styles.modalItem}>• {h}</Text>
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
    </ScrollView>
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
    flex: 1, backgroundColor: '#1e1e1e', color: '#fff',
    padding: 10, borderRadius: 10, marginRight: 10
  },
  addButton: { backgroundColor: '#00ffe0', padding: 10, borderRadius: 10 },
  addText: { color: '#000', fontWeight: 'bold' },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20, borderRadius: 12,
    width: '80%', alignItems: 'center'
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#00ffe0', marginBottom: 10 },
  modalItem: { color: '#ccc', fontSize: 14, marginBottom: 5 },
  closeBtn: { marginTop: 15, padding: 10, backgroundColor: '#00ffe0', borderRadius: 10 }
});
