import React from 'react';
import { Button, Alert } from 'react-native';
import { account } from '@/services/appwrite';
import { View } from 'react-native';

export default function ConnectTest() {
  const handleConnect = async () => {
    try {
      const res = await account.createAnonymousSession();
      Alert.alert('Connected!', JSON.stringify(res));
    } catch (err) {
      Alert.alert('Error', err.message);
      console.error(err);
    }
  };

  return (
    <View className="mt-12">

      <Button title="Connect to Appwrite" onPress={handleConnect} />
    </View>
  )
}
