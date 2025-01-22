import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from '../styles';
import { Contact } from '../types';

const ContactsScreen: React.FC = () => {
  const [rows, setRows] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<Contact | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

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
      setRows([...rows, { id: Date.now().toString(), name, contact }]);
      setName('');
      setContact('');
    }
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
