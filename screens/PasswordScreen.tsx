import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { useTranslation } from "react-i18next";

const PASSWORD_KEY = 'app_password';
const TERMINATION_PASSWORD_KEY = 'termination_password';

const PasswordScreen: React.FC = () => {
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState<string>('');
  const [newTerminationPassword, setNewTerminationPassword] = useState<string>('');
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [hasTerminationPassword, setHasTerminationPassword] = useState<boolean>(false);

  useEffect(() => {
    const checkPassword = async () => {
      const storedPassword = await AsyncStorage.getItem(PASSWORD_KEY);
      setHasPassword(!!storedPassword);
      const storedTerminationPassword = await AsyncStorage.getItem(TERMINATION_PASSWORD_KEY);
      setHasTerminationPassword(!!storedTerminationPassword);
    };
    checkPassword();
  }, []);

  const savePassword = async () => {
    if (newPassword.trim()) {
      await AsyncStorage.setItem(PASSWORD_KEY, newPassword);
      setHasPassword(true);
      setNewPassword('');
    }
  };

  const saveTerminationPassword = async () => {
    if (newTerminationPassword.trim()) {
      await AsyncStorage.setItem(TERMINATION_PASSWORD_KEY, newTerminationPassword);
      setHasTerminationPassword(true);
      setNewTerminationPassword('');
    }
  };

  const removePassword = async () => {
    await AsyncStorage.removeItem(PASSWORD_KEY);
    setHasPassword(false);
  };

  const removeTerminationPassword = async () => {
    await AsyncStorage.removeItem(TERMINATION_PASSWORD_KEY);
    setHasTerminationPassword(false);
  };

  return (
    <View style={styles.container}>
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
      {hasPassword && (
        <TouchableOpacity style={styles.removeButton} onPress={removePassword}>
          <Text style={styles.removeButtonText}>{t("Remove Password")}</Text>
        </TouchableOpacity>
      )}

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
      {hasTerminationPassword && (
        <TouchableOpacity style={styles.removeButton} onPress={removeTerminationPassword}>
          <Text style={styles.removeButtonText}>{t("Remove Termination Password")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PasswordScreen;
