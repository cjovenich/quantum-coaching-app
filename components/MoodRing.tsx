\// app/components/MoodRing.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

type Emotion = {
  name: string;
};

interface MoodRingProps {
  emotions: Emotion[];
}

const MoodRing: React.FC<MoodRingProps> = ({ emotions }) => {
  const size = 200;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference / Math.max(emotions.length, 1); // prevent divide-by-zero

  const emotionColors: Record<string, string> = {
    Happiness: '#FFD700',
    Sadness: '#87CEFA',
    Anger: '#FF4500',
    Calm: '#00CED1',
    Anxious: '#FFA07A',
    Excited: '#7FFF00',
    Wild: '#FF69B4',
    default: '#D3D3D3',
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {emotions.map((emotion, index) => {
          const color = emotionColors[emotion.name] || emotionColors.default;
          const rotation = (index * arcLength * 360) / circumference;

          return (
            <G
              key={`${emotion.name}-${index}`}
              rotation={rotation}
              origin={`${center}, ${center}`}
            >
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength}, ${circumference}`}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default MoodRing;
