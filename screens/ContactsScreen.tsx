import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { Contact } from '../types';

const STORAGE_KEY = '@contacts_list';

const ContactsScreen: React.FC = () => {
  const [rows, setRows] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<Contact | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  // Load contacts from AsyncStorage on mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Save contacts to AsyncStorage whenever rows change
  useEffect(() => {
    saveContacts();
  }, [rows]);

  // Load contacts from AsyncStorage
  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts) {
        setRows(JSON.parse(storedContacts));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts.');
    }
  };

  // Save contacts to AsyncStorage
  const saveContacts = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (error) {
      Alert.alert('Error', 'Failed to save contacts.');
    }
  };

  // Confirm delete contact
  const confirmDelete = (row: Contact) => {
    setSelectedRow(row);
    setDeleteModalVisible(true);
  };

  // Remove contact
  const removeRow = () => {
    if (selectedRow) {
      setRows(rows.filter(row => row.id !== selectedRow.id));
      setSelectedRow(null);
      setDeleteModalVisible(false);
    }
  };

  // Save new contact
  const saveRow = () => {
    if (name.trim() && contact.trim()) {
      setRows([...rows, { id: Date.now().toString(), name, contact }]);
      setName('');
      setContact('');
    }
    setIsAdding(false);
  };

  // Cancel adding contact
  const cancelAdding = () => {
    setName('');
    setContact('');
    setIsAdding(false);
  };

  return (
    <View style={styles.container}>
      {rows.length === 0 ? (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>No contacts available.</Text>
          <Text style={styles.noContactsSubText}>Click "Add Contact" to create a new one.</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.row}>
              <Text style={styles.rowText}>{item.name}</Text>
              <Text style={styles.rowSubText}>{item.contact}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setIsAdding(true)}>
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>

      {/* Add Contact Modal */}
      <Modal visible={isAdding} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Contact"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={saveRow}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelAdding}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Contact</Text>
            <Text style={styles.modalText}>Are you sure you want to delete {selectedRow?.name}?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={removeRow}>
                <Text style={styles.saveButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContactsScreen;
