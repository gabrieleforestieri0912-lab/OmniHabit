import { months } from './constants';

export const getExpStats = (monthHabits) => {
  const totalStreak = monthHabits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const level = Math.min(5, Math.floor(totalStreak / 10) + 1);
  const expInLevel = totalStreak % 10;
  const progress = (expInLevel / 10) * 100;
  return { level, totalStreak, progress, expInLevel };
};

export const getPieData = (monthHabits) => {
  const completed = monthHabits.filter(h => h.completed).length;
  const remaining = monthHabits.length - completed;
  return [
    { name: 'Completati', value: completed },
    { name: 'Rimanenti', value: remaining }
  ];
};

export const getGlobalStats = (habits) => {
  const allHabits = Object.values(habits).flat();
  const totalHabits = allHabits.length;
  const completedHabits = allHabits.filter(h => h.completed).length;
  const totalStreak = allHabits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const maxStreak = Math.max(...allHabits.map(h => h.streak || 0), 0);
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  return { totalHabits, completedHabits, totalStreak, maxStreak, completionRate };
};

export const getWeeklyProgress = (habits) => {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push({
      day: date.toLocaleDateString('it-IT', { weekday: 'short' }),
      date: date.toISOString().split('T')[0]
    });
  }
  return last7Days.map(d => {
    const dayOfMonth = parseInt(d.date.split('-')[2]);
    const monthIndex = parseInt(d.date.split('-')[1]) - 1;
    const month = months[monthIndex];
    const monthHabits = habits[month] || [];
    const dayCompletions = monthHabits.filter(h => {
      const habitDay = (h.streak || 0) % 30;
      return habitDay === dayOfMonth || (h.completed && Math.random() > 0.5);
    }).length;
    return {
      day: d.day,
      completions: dayCompletions,
      max: Math.max(...monthHabits.map(h => h.streak || 0), 1)
    };
  });
};

export const getMonthlyTrend = (habits) => {
  return months.slice(0, 6).map(month => {
    const monthHabits = habits[month] || [];
    const completed = monthHabits.filter(h => h.completed).length;
    const total = monthHabits.length;
    return {
      month: month.slice(0, 3),
      rate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });
};

export const getLevelFromStreak = (totalStreak) => {
  return Math.min(10, Math.floor(totalStreak / 10) + 1);
};

export const getUserLevel = (habits) => {
  const stats = getGlobalStats(habits);
  return getLevelFromStreak(stats.totalStreak);
};