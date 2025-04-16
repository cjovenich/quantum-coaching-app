import 'react-native-reanimated'; // 👈 MUST come first
import React from 'react';
import { useAppTheme } from '../theme'; // adjust path if needed
import { Tabs } from 'expo-router';

export default function Layout() {
  const theme = useAppTheme();

  return <Tabs screenOptions={{ headerShown: false }} />;
}
