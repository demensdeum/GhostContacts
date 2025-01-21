import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Password Prompt on App Start
const PasswordPrompt = ({ onAuthenticate }) => {
  const [inputPassword, setInputPassword] = useState('');

  const checkPassword = async () => {
    const savedPassword = await AsyncStorage.getItem('app_password');
    if (savedPassword === inputPassword) {
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

// Contacts Screen
const ContactsScreen = () => {
  const [rows, setRows] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  // Show modal and store the row for deletion
  const confirmDelete = (row) => {
    setSelectedRow(row);
    setDeleteModalVisible(true);
  };

  // Delete the selected row
  const removeRow = () => {
    if (selectedRow) {
      setRows(prevRows => prevRows.filter(row => row.id !== selectedRow.id));
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

  const cancelAdding = () => {
    setName('');
    setContact('');
    setIsAdding(false);
  };

  return (
    <View style={styles.container}>
      {rows.length === 0 ? (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>No contacts are available.</Text>
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
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setIsAdding(true)}>
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>

      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Contact</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete {selectedRow?.name}?
            </Text>
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
    </View>
  );
};

// Password Screen
const PasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');

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

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  useEffect(() => {
    const checkStoredPassword = async () => {
      const password = await AsyncStorage.getItem('app_password');
      setIsPasswordSet(!!password);
    };
    checkStoredPassword();
  }, []);

  if (isPasswordSet && !authenticated) {
    return <PasswordPrompt onAuthenticate={setAuthenticated} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: route.name === 'Contacts' ? '🧑‍🤝‍🧑 Contacts' : '🔑 Password',
        })}
      >
        <Tab.Screen name="Contacts" component={ContactsScreen} />
        <Tab.Screen name="Password" component={PasswordScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  list: { paddingBottom: 120 },
  row: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    backgroundColor: '#f9f9f9', 
    marginBottom: 5, 
    borderRadius: 5 
  },
  rowText: { fontSize: 16, fontWeight: 'bold', color: 'black' },
  rowSubText: { fontSize: 14, color: 'gray' },
  
  button: { 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20, 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    width: 320, 
    padding: 20, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  input: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },

  buttonRow: { 
    flexDirection: 'row',  // Places buttons in a row
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 10 
  },

  cancelButton: { 
    //flex: 1, 
    backgroundColor: 'red', // 🔴 Red Cancel Button
    padding: 12, 
    borderRadius: 5, 
    alignItems: 'center',
    marginRight: 5 // Adds spacing between buttons
  },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

saveButton: {
    //width: '100%', // Ensures it doesn't expand beyond the container
    paddingVertical: 12, // Controls button height
    paddingHorizontal: 20, 
    backgroundColor: '#28a745', 
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  passwordTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5, // Adds 5 pixels of spacing below the title
  },  
  noContactsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noContactsText: { fontSize: 18, fontWeight: 'bold', color: 'gray', marginBottom: 10 },
  noContactsSubText: { fontSize: 14, color: 'gray' },
});


export default App;
