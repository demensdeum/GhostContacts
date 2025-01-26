import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert, CheckBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { Contact } from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from "react-i18next";
import { useTheme } from '../ThemeContext';

const STORAGE_KEY = '@contacts_list';

const ContactsScreen: React.FC<{ refreshFlag: boolean }> = ({ refreshFlag }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
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
}, [refreshFlag]);

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
    <Text style={[styles.modalTitle, { color: theme.text }]}>{t("Contacts")}</Text>
      {rows.length === 0 ? (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>{t("No contacts available.")}</Text>
          <Text style={styles.noContactsSubText}>{t("Click \"Add Contact\" to create a new one.")}</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => editRow(item)} style={[styles.row, { backgroundColor: theme.background }]}>
              <View>
                <Text style={[styles.rowText, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.rowSubText, { color: theme.text }]}>{item.contact}</Text>
                {item.keepAfterWipe && (
                  <Text style={[styles.keepAfterWipeText, { color: theme.text }]}>{t("Keep After Wipe")}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => confirmDelete(item)} style={[styles.removeButton, { backgroundColor: theme.buttonBackground }]}>
                <Icon name="trash" size={18} color={theme.text} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackground }]} onPress={() => setIsAdding(true)}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{t("Add Contact")}</Text>
      </TouchableOpacity>

      <Modal visible={isAdding} transparent animationType="fade">
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{isEditing ? t('Edit Contact') : t('Add New Contact')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder={t("Enter Name")}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder={t("Enter Contact")}
              value={contact}
              onChangeText={setContact}
            />
            <View style={styles.checkboxRow}>
              <CheckBox
                value={keepAfterWipe}
                onValueChange={setKeepAfterWipe}
              />
              <Text style={[styles.checkboxLabel, { color: theme.text }]}>{t("Keep After Wipe")}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonBackground }]} onPress={saveRow}>
                <Text style={[styles.saveButtonText, { color: theme.text }]}>{t("Save")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.buttonBackground }]} onPress={cancelAdding}>
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>{t("Cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t("Delete Contact")}</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>{t("Are you sure you want to delete")} {selectedRow?.name} ?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonBackground }]} onPress={removeRow}>
                <Text style={[styles.saveButtonText, { color: theme.text }]}>{t("Delete")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.buttonBackground }]} onPress={() => setDeleteModalVisible(false)}>
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>{t("Cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContactsScreen;
