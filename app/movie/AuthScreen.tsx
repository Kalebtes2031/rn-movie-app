import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';

export default function AuthScreen() {
  const { login, register, user, logout } = useContext(AuthContext)!;
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  if (user) {
    return (
      <View>
        <Text>Welcome, {user.name || user.email}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  return (
    <View>
      {mode === 'signup' && (
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={mode === 'login' ? 'Login' : 'Register'}
        onPress={handleSubmit}
      />
      <Button
        title={mode === 'login' ? 'Switch to Signup' : 'Switch to Login'}
        onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
      />
    </View>
  );
}
