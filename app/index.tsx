import Home from '@/app/(tabs)/index'; // your current index.tsx UI separated
import { useAuth } from '@/contexts/AuthContext';
import type { Href } from 'expo-router';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null; // or loading spinner

  if (!user) {
    const signinHref = '/signin' as Href;
    return <Redirect href={signinHref} />;
  }

  return <Home />;
}