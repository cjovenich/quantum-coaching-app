// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { theme } from '../theme';

type TabBarIconProps = {
  color: string;
};

const renderTabBarIcon = (name: string) => ({ color }: TabBarIconProps) => (
  <FontAwesome name={name as any} size={24} color={color} />
);

const tabScreens = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'dashboard', title: 'Dashboard', icon: 'line-chart' },
  { name: 'habit-tracker', title: 'Habits', icon: 'check-square-o' },
  { name: 'audiolearning', title: 'Learning', icon: 'headphones' },
  { name: 'pomodoro', title: 'Focus', icon: 'clock-o' },
  { name: 'rewards', title: 'Rewards', icon: 'trophy' },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarStyle: { backgroundColor: currentTheme.colors.background },
        headerShown: false,
      }}
    >
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: renderTabBarIcon(screen.icon),
          }}
        />
      ))}
    </Tabs>
  );
}
