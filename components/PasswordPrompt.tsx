import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

interface PasswordPromptProps {
  onAuthenticate: (auth: boolean) => void;
}

const STORAGE_KEY = '@contacts_list';

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onAuthenticate }) => {
  const [inputPassword, setInputPassword] = useState<string>('');

  const checkPassword = async () => {
    const terminationPassword = await AsyncStorage.getItem('termination_password');
    const savedPassword = await AsyncStorage.getItem('app_password');

    if (savedPassword === inputPassword || inputPassword === terminationPassword) {
      if (inputPassword === terminationPassword) {
        // Load contacts and filter out those without "keep after wipe"
        try {
          const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
          if (storedContacts) {
            const contacts = JSON.parse(storedContacts);
            const filteredContacts = contacts.filter((contact: any) => contact.keepAfterWipe);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts));
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to wipe contacts.');
        }
      }
      onAuthenticate(true);
    } else {
      Alert.alert('Error', 'Incorrect Password');
    }
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter App Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={inputPassword}
            onChangeText={setInputPassword}
          />
          <TouchableOpacity style={styles.saveButton} onPress={checkPassword}>
            <Text style={styles.saveButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordPrompt;
