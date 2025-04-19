interface Habit {
    label: string;
    category: string;
    streak?: number;
    favorite?: boolean;
  }
  
  // Base suggestions
  const baseHabits: Habit[] = [
    { label: 'Drink water', category: 'Health' },
    { label: 'Walk 15 minutes', category: 'Movement' },
    { label: 'Stretch or breathe', category: 'Mindfulness' },
    { label: 'Read 1 page', category: 'Learning' },
    { label: 'Check calendar', category: 'Productivity' },
    { label: 'Clean something small', category: 'Home' },
  ];
  
  const morningHabits: Habit[] = [
    { label: 'Make your bed', category: 'Routine' },
    { label: 'Morning sunlight', category: 'Health' },
    { label: 'Plan your day', category: 'Productivity' },
  ];
  
  const eveningHabits: Habit[] = [
    { label: 'Reflect on the day', category: 'Mindfulness' },
    { label: 'Prep for tomorrow', category: 'Productivity' },
    { label: 'Tidy up your space', category: 'Home' },
  ];
  
  // Pinned favorites (user defined or fixed for now)
  const pinnedFavorites: Habit[] = [
    { label: 'Gratitude journal', category: 'Mindfulness', favorite: true },
    { label: 'Cold shower', category: 'Health', favorite: true },
  ];
  
  // Rotate suggestions based on day of month
  const rotateByDay = (habits: Habit[]) => {
    const day = new Date().getDate();
    const offset = day % habits.length;
    return [...habits.slice(offset), ...habits.slice(0, offset)];
  };
  
  export const suggestHabits = (
    timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning',
    userStreaks: Record<string, number> = {},
    completedHabits: string[] = []
  ): Habit[] => {
    let suggestions: Habit[] = [...baseHabits];
  
    if (timeOfDay === 'morning') suggestions.push(...morningHabits);
    if (timeOfDay === 'evening') suggestions.push(...eveningHabits);
  
    // Apply streak logic — boost habits with high streaks
    suggestions = suggestions.map(habit => ({
      ...habit,
      streak: userStreaks[habit.label] || 0,
    }));
  
    // Filter out completed habits
    suggestions = suggestions.filter(habit => !completedHabits.includes(habit.label));
  
    // Sort: favorites first, then by streak desc
    suggestions.sort((a, b) => {
      if (a.favorite) return -1;
      if (b.favorite) return 1;
      return (b.streak || 0) - (a.streak || 0);
    });
  
    // Rotate results daily
    return [...pinnedFavorites, ...rotateByDay(suggestions).slice(0, 5)];
  };
  