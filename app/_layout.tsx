// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAppTheme } from '../theme';

export default function Layout() {
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
