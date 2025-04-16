import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';
import { fetchUserData } from '../sync';
import { emotions } from '../data/emotions';
import { Image } from 'react-native';

export default function MoodRing() {
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const loadMoodData = async () => {
      try {
        const data = await fetchUserData();
        const emotionCalendar = data.emotionCalendar || {};
        const formatted = Object.keys(emotionCalendar).map((date) => ({
          date,
          mood: emotionCalendar[date],
        }));
        setMoodHistory(formatted);
      } catch (error) {
        console.error('Failed to fetch mood data:', error);
      }
    };
    loadMoodData();
  }, []);

  const getMoodColor = (moodName: string) => {
    // You can define specific color mappings if desired
    const colors = {
      Happy: '#FFD700',
      Sadness: '#4682B4',
      Angry: '#FF4500',
      Calm: '#00CED1',
      Inspired: '#9932CC',
    };
    return colors[moodName] || '#8A2BE2';
  };

  const lineData = moodHistory.map((entry, index) => ({
    x: index + 1,
    y: emotions.findIndex((e) => e.name === entry.mood) + 1,
    label: entry.mood,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Mood Ring Tracker</Text>
      {moodHistory.length === 0 ? (
        <Text style={styles.noData}>No mood data yet. Track emotions to see trends!</Text>
      ) : (
        <>
          <VictoryChart domainPadding={20}>
            <VictoryAxis
              tickFormat={(x) => `Day ${x}`}
              style={{
                tickLabels: { fontSize: 10, angle: -30, padding: 10, fill: '#fff' },
                axis: { stroke: '#888' },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(y) => emotions[y - 1]?.name || ''}
              style={{
                tickLabels: { fontSize: 10, fill: '#fff' },
                axis: { stroke: '#888' },
              }}
            />
            <VictoryLine
              data={lineData}
              interpolation="natural"
              style={{
                data: { stroke: '#00ffe0', strokeWidth: 3 },
                labels: { fill: '#aaa', fontSize: 10 },
              }}
            />
          </VictoryChart>

          <ScrollView horizontal style={styles.iconRow}>
            {moodHistory.slice(-7).map((entry, index) => {
              const iconSource = emotions.find((e) => e.name === entry.mood)?.icon;
              return (
                <View key={index} style={styles.iconItem}>
                  <Image source={iconSource} style={styles.icon} />
                  <Text style={styles.iconLabel}>{entry.mood}</Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
  },
  title: {
    color: '#00ffe0',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noData: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  iconRow: {
    marginTop: 20,
  },
  iconItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
});
