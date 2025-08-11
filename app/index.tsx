import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarding');
        setOnboardingDone(value === 'done');
      } catch {
        setOnboardingDone(false);
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!authLoading && onboardingDone !== null) {
      if (!user) {
        router.replace('/(auth)/signin');
      } else if (onboardingDone) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, authLoading, onboardingDone]);

  const handleContinue = async () => {
    await AsyncStorage.setItem('onboarding', 'done');
    router.replace('/(tabs)/home');
  };

  if (authLoading || onboardingDone === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!onboardingDone) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Movie App!</Text>
        <Text style={styles.subtitle}>
          Discover and save your favorite movies.
        </Text>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
});
