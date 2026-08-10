'use client';

import { useState, useEffect } from 'react';
import ChatPage from '../components/ChatPage';
import { API_URL } from '../components/constants';
import { useGoBack } from '../components/useGoBack';
import type { User, Habit, HabitsMap } from '../types';

export default function ChatRoute() {
  const goBack = useGoBack();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<HabitsMap>({});

  useEffect(() => {
    const token = localStorage.getItem('omni_token');
    if (!token) return;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('auth')))
      )
      .then((data) => {
        setUser(data.user);
        return fetch(`${API_URL}/habits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then((res) => res.json())
      .then((data: Habit[]) => {
        const grouped = data.reduce<HabitsMap>((acc, habit) => {
          if (!acc[habit.month]) acc[habit.month] = [];
          acc[habit.month].push(habit);
          return acc;
        }, {});
        setHabits(grouped);
      })
      .catch(() => {
        // Utente non autenticato: ChatPage mostra la schermata "Accesso Richiesto"
      });
  }, []);

  return (
    <ChatPage
      onBack={goBack}
      user={user}
      habits={habits}
      onAuthClick={() => window.location.assign('/login')}
    />
  );
}
