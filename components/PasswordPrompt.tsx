import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import bcrypt from 'react-native-bcrypt';

interface PasswordPromptProps {
  onAuthenticate: (success: boolean) => void;
}

const STORAGE_KEY = '@contacts_list';

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onAuthenticate }) => {
  const [inputPassword, setInputPassword] = useState<string>('');
  const { t } = useTranslation();

  const checkPassword = async () => {
    try {
      const [appHash, terminationHash] = await Promise.all([
        AsyncStorage.getItem('app_password'),
                                                           AsyncStorage.getItem('termination_password'),
      ]);

      const isAppValid = appHash && bcrypt.compareSync(inputPassword, appHash);
      const isTerminationValid = terminationHash && bcrypt.compareSync(inputPassword, terminationHash);

      if (isTerminationValid) {
        const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedContacts) {
          const contacts = JSON.parse(storedContacts);
          const filteredContacts = contacts.filter((contact: any) => contact.keepAfterWipe);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts));
        }
      }

      if (isAppValid || isTerminationValid) {
        onAuthenticate(true);
      } else {
        Alert.alert(t("Error"), t("Incorrect Password"));
        onAuthenticate(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check or wipe contacts.');
      onAuthenticate(false);
    }
  };

  return (
    <Modal visible={true} transparent animationType="fade">
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>{t("Enter App Password")}</Text>
    <TextInput
    style={styles.input}
    placeholder={t("Password")}
    placeholderTextColor="#888"
    secureTextEntry
    value={inputPassword}
    onChangeText={setInputPassword}
    onSubmitEditing={checkPassword}
    />
    <TouchableOpacity style={styles.saveButton} onPress={checkPassword}>
    <Text style={styles.saveButtonText}>{t("Login")}</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
  );
};

export default PasswordPrompt;
