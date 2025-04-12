import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationLightTheme,
    Theme as NavigationTheme,
  } from '@react-navigation/native';
  import { useColorScheme } from 'react-native';
  
  // Custom color definitions
  const baseColors = {
    primary: '#00ffe0',
    secondary: '#ff6f00',
    success: '#00c853',
    danger: '#dc3545',
    warning: '#ffc107',
  };
  
  // Light Theme
  export const LightTheme: NavigationTheme = {
    ...NavigationLightTheme,
    colors: {
      ...NavigationLightTheme.colors,
      background: '#ffffff',
      card: '#f5f5f5',
      text: '#000000',
      primary: baseColors.primary,
      border: '#e0e0e0',
      notification: baseColors.secondary,
    },
  };
  
  // Dark Theme
  export const DarkTheme: NavigationTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background: '#000000',
      card: '#1e1e1e',
      text: '#ffffff',
      primary: baseColors.primary,
      border: '#333333',
      notification: baseColors.secondary,
    },
  };
  
  // Hook to get active theme
  export const useAppTheme = () => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? DarkTheme : LightTheme;
  };
  