
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarding');
        if (value === 'done') {
          router.replace('/(tabs)/home');
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleContinue = async () => {
    await AsyncStorage.setItem('onboarding', 'done');
    router.replace('/(tabs)/home');
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Movie App!</Text>
      <Text style={styles.subtitle}>Discover and save your favorite movies.</Text>
      <Button
        title="Continue"
        onPress={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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