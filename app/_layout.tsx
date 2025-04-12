import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { useAppTheme } from '../theme'; // ✅ Make sure theme.ts exports useAppTheme()

export default function RootLayout() {
  const theme = useAppTheme(); // Uses system color scheme (light/dark)

  return (
    <NavigationContainer theme={theme}>
      <Slot />
    </NavigationContainer>
  );
}
