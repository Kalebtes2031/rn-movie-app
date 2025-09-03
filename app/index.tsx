import Home from '@/app/(tabs)/index'; // your current index.tsx UI separated
import AuthScreen from '@/app/movie/AuthScreen'; // or wherever it lives
import { AuthContext } from '@/contexts/AuthContext';
import React, { useContext } from 'react';

export default function Index() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('Index must be used within an AuthProvider');
  }
  
  const { user, loading } = context;

  if (loading) return null; // or loading spinner

  if (!user) {
    return <AuthScreen />;
  }

  return <Home />;
}