import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert, CheckBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { Contact } from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

const STORAGE_KEY = '@contacts_list';

const ContactsScreen: React.FC = () => {
  const [rows, setRows] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [keepAfterWipe, setKeepAfterWipe] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Contact | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    saveContacts();
  }, [rows]);

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

  const saveContacts = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (error) {
      Alert.alert('Error', 'Failed to save contacts.');
    }
  };

  const confirmDelete = (row: Contact) => {
    setSelectedRow(row);
    setDeleteModalVisible(true);
  };

  const removeRow = () => {
    if (selectedRow) {
      setRows(rows.filter(row => row.id !== selectedRow.id));
      setSelectedRow(null);
      setDeleteModalVisible(false);
    }
  };

  const saveRow = () => {
    if (name.trim() && contact.trim()) {
      if (isEditing && selectedRow) {
        setRows(rows.map(row => 
          row.id === selectedRow.id ? { ...row, name, contact, keepAfterWipe } : row
        ));
      } else {
        setRows([...rows, { id: Date.now().toString(), name, contact, keepAfterWipe }]);
      }
      setName('');
      setContact('');
      setKeepAfterWipe(false);
      setIsEditing(false);
      setSelectedRow(null);
    }
    setIsAdding(false);
  };

  const editRow = (row: Contact) => {
    setSelectedRow(row);
    setName(row.name);
    setContact(row.contact);
    setKeepAfterWipe(row.keepAfterWipe);
    setIsEditing(true);
    setIsAdding(true);
  };

  const cancelAdding = () => {
    setName('');
    setContact('');
    setKeepAfterWipe(false);
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
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => editRow(item)} style={styles.row}>
              <View>
                <Text style={styles.rowText}>{item.name}</Text>
                <Text style={styles.rowSubText}>{item.contact}</Text>
                {item.keepAfterWipe && (
                  <Text style={styles.keepAfterWipeText}>Keep After Wipe</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.removeButton}>
                <Icon name="trash" size={18} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setIsAdding(true)}>
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>

      <Modal visible={isAdding} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Contact' : 'Add New Contact'}</Text>
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
            <View style={styles.checkboxRow}>
              <CheckBox
                value={keepAfterWipe}
                onValueChange={setKeepAfterWipe}
              />
              <Text style={styles.checkboxLabel}>Keep After Wipe</Text>
            </View>
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
