import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

const PasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');

  const savePassword = async () => {
    if (newPassword.trim()) {
      await AsyncStorage.setItem('app_password', newPassword);
      Alert.alert('Success', 'Password has been updated.');
      setNewPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.passwordTitle}>Set or Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
        <Text style={styles.saveButtonText}>Save Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordScreen;
