import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { emotions } from '../data/emotions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmotionTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [calendarEmotions, setCalendarEmotions] = useState({});
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Load stored emotion log on mount
  useEffect(() => {
    const loadEmotions = async () => {
      try {
        const saved = await AsyncStorage.getItem('emotion_log');
        if (saved) {
          setCalendarEmotions(JSON.parse(saved));
        }
      } catch (err) {
        console.warn('Failed to load emotion log:', err);
      }
    };
    loadEmotions();
  }, []);

  // Animate icon on change
  useEffect(() => {
    if (selectedEmotion) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedEmotion]);

  const handleEmotionSelect = async (emotion) => {
    setSelectedEmotion(emotion);

    const updated = {
      ...calendarEmotions,
      [selectedDate]: {
        selected: true,
        marked: true,
        selectedColor: '#8A2BE2',
        emotion: emotion.name,
        customStyles: {
          container: {
            backgroundColor: '#8A2BE2',
            borderRadius: 8,
          },
          text: {
            color: 'white',
          },
        },
      }
    };

    setCalendarEmotions(updated);

    try {
      await AsyncStorage.setItem('emotion_log', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save emotion log:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={calendarEmotions}
        markingType={'custom'}
        theme={{
          selectedDayBackgroundColor: '#8A2BE2',
          todayTextColor: '#8A2BE2',
          dayTextColor: '#222',
          textDisabledColor: '#888',
        }}
      />
      <View style={styles.emotionList}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.name}
            style={[
              styles.emotionItem,
              selectedEmotion?.name === emotion.name && styles.selectedEmotion,
            ]}
            onPress={() => handleEmotionSelect(emotion)}
          >
            <Animated.View style={{ transform: [{ scale: selectedEmotion?.name === emotion.name ? scaleAnim : 1 }] }}>
              <Image source={emotion.icon} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </Animated.View>
            <Text style={styles.emotionName}>{emotion.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emotionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  emotionItem: {
    alignItems: 'center',
    marginVertical: 8,
    padding: 5,
    borderRadius: 8,
    width: '30%',
  },
  selectedEmotion: {
    backgroundColor: '#E6E6FA',
  },
  emotionName: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
});

export default EmotionTracker;
