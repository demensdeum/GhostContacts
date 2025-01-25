import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { useTranslation } from "react-i18next";

const PASSWORD_KEY = 'app_password';
const TERMINATION_PASSWORD_KEY = 'termination_password';

const PasswordScreen: React.FC = () => {
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState<string>('');
  const [newTerminationPassword, setNewTerminationPassword] = useState<string>('');

  const savePassword = async () => {
    if (newPassword.trim()) {
      await AsyncStorage.setItem(PASSWORD_KEY, newPassword);
      setNewPassword('');
    }
  };

  const saveTerminationPassword = async () => {
    if (newTerminationPassword.trim()) {
      await AsyncStorage.setItem(TERMINATION_PASSWORD_KEY, newTerminationPassword);
      setNewTerminationPassword('');
    }
  };

  const removePassword = async () => {
    await AsyncStorage.removeItem(PASSWORD_KEY);
  };

  const removeTerminationPassword = async () => {
    await AsyncStorage.removeItem(TERMINATION_PASSWORD_KEY);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>{t("Passwords")}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.passwordTitle}>{t("Set or Change Password")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("Enter New Password")}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
        <Text style={styles.saveButtonText}>{t("Save Password")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={removePassword}>
        <Text style={styles.removeButtonText}>{t("Remove Password")}</Text>
      </TouchableOpacity>

      <View style={styles.sectionSpacing} />

      <Text style={styles.passwordTitle}>{t("Set or Change Termination Password")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("Enter New Wipe Password")}
        secureTextEntry
        value={newTerminationPassword}
        onChangeText={setNewTerminationPassword}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveTerminationPassword}>
        <Text style={styles.saveButtonText}>{t("Save Termination Password")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={removeTerminationPassword}>
        <Text style={styles.removeButtonText}>{t("Remove Termination Password")}</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PasswordScreen;
