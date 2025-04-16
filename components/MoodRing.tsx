import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const MoodRing = ({ emotions }) => {
  const size = 200;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const arcLength = (2 * Math.PI * radius) / emotions.length;

  const emotionColors = {
    Happiness: '#FFD700',
    Sadness: '#87CEFA',
    Anger: '#FF4500',
    // ... define colors for all emotions
    Wild: '#FF69B4',
    default: '#D3D3D3',
  };

  return (
    <View>
      <Svg width={size} height={size}>
        {emotions.map((emotion, index) => {
          const color = emotionColors[emotion.name] || emotionColors.default;
          const startAngle = index * arcLength;
          const endAngle = startAngle + arcLength;

          return (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${2 * Math.PI * radius - arcLength}`}
              rotation={(startAngle * 180) / Math.PI}
              origin={`${center}, ${center}`}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default MoodRing;
