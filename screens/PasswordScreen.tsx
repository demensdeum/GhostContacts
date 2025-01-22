import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

const PasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [hasPassword, setHasPassword] = useState<boolean>(false);

  useEffect(() => {
    const checkPassword = async () => {
      const storedPassword = await AsyncStorage.getItem('app_password');
      setHasPassword(!!storedPassword);
    };
    checkPassword();
  }, []);

  const savePassword = async () => {
    if (newPassword.trim()) {
      await AsyncStorage.setItem('app_password', newPassword);
      Alert.alert('Success', 'Password has been updated.');
      setNewPassword('');
      setHasPassword(true);
    }
  };

  const confirmRemovePassword = async () => {
    const storedPassword = await AsyncStorage.getItem('app_password');
    if (!storedPassword) {
      Alert.alert('Error', 'No password is set.');
      setModalVisible(false);
      return;
    }
    if (currentPassword !== storedPassword) {
      Alert.alert('Error', 'Incorrect password.');
      return;
    }
    await AsyncStorage.removeItem('app_password');
    Alert.alert('Success', 'Password has been removed.');
    setCurrentPassword('');
    setModalVisible(false);
    setHasPassword(false);
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

      {hasPassword && (
        <TouchableOpacity style={styles.removeButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.removeButtonText}>Remove Password</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.passwordTitle}>Enter Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmRemovePassword}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PasswordScreen;
