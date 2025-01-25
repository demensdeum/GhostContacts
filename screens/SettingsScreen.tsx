import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import i18next from "../i18n";
import styles from "../styles";
import * as DocumentPicker from 'expo-document-picker';
import { decode as atob } from 'base-64';

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

const STORAGE_KEY = "@contacts_list";

const SettingsScreen: React.FC<{ setRefreshFlag: (value: boolean) => void }> = ({ setRefreshFlag }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);  

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      setSelectedLanguage(savedLanguage || "en");
      setLoading(false);
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    await AsyncStorage.setItem("language", languageCode);
    await i18next.changeLanguage(languageCode);
  };

  const removeAllContacts = async () => {
    try {
      // Remove all contacts by setting an empty array
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      
      // Trigger refresh of the main screen
      setRefreshFlag(prev => !prev);
      
      console.log("All contacts removed successfully");
    } catch (error) {
      console.log("Remove all contacts error:", error);
    }
  };

const importContactsFromCSV = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: "text/csv" });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log("Import canceled.");
      return;
    }

    const file = result.assets[0];

    if (!file.uri.startsWith("data:text/csv;base64,")) {
      console.log("Invalid file format.");
      return;
    }

    // Decode Base64 content
    const base64String = file.uri.split(",")[1];
    const fileContent = atob(base64String);

    const rows = fileContent.split("\n").map(row => row.trim()).filter(row => row);
    if (rows.length < 2) {
      console.log("Invalid CSV format");
      return;
    }

    const newContacts = rows.slice(1).map(row => {
      const [name, contact, keepAfterWipe] = row.split(",");
      return {
        id: Date.now().toString(),
        name: name.trim(),
        contact: contact.trim(),
        keepAfterWipe: keepAfterWipe.trim().toLowerCase() === "yes",
      };
    });

    // Save contacts to AsyncStorage
    const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
    const contacts = storedContacts ? JSON.parse(storedContacts) : [];
    const updatedContacts = [...contacts, ...newContacts];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContacts));

    console.log(`Imported ${newContacts.length} contacts successfully.`);

    setRefreshFlag(prev => !prev);

  } catch (error) {
    console.log("Import error:", error);
  }
}

  const exportContactsToCSV = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      const contacts = storedContacts ? JSON.parse(storedContacts) : [];

      console.log(`Exporting ${contacts.length} contacts...`);

      // Convert contacts to CSV format
      const header = "Name,Contact,KeepAfterWipe\n";
      const csvContent = contacts
        .map((contact: any) => `${contact.name},${contact.contact},${contact.keepAfterWipe ? "Yes" : "No"}`)
        .join("\n");

      const csvData = header + csvContent;

      if (Platform.OS === "web") {
        // 🔹 Web: Use Blob and create a downloadable link
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "contacts.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // 📱 Mobile: Save file using expo-file-system
        const fileUri = `${FileSystem.documentDirectory}contacts.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          console.log(`File saved at: ${fileUri}`);
        }
      }

      console.log("Export successful.");

    } catch (error) {
      console.log("Export error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>{t("Settings")}</Text>
      
      {/* Language Selection Buttons */}
      {LANGUAGES.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={[
            styles.row,
            selectedLanguage === language.code && styles.selectedRow,
          ]}
          onPress={() => changeLanguage(language.code)}
        >
          <Text
            style={[
              styles.rowText,
              selectedLanguage === language.code && styles.selectedRowText,
            ]}
          >
            {language.label}
          </Text>
        </TouchableOpacity>
      ))}

<TouchableOpacity
  key="import-csv"
  style={styles.row}
  onPress={importContactsFromCSV}
>
  <Text style={styles.rowText}>{t("Import Contacts CSV")}</Text>
</TouchableOpacity>


      {/* Export Contacts Button */}
      <TouchableOpacity
        key="export-csv"
        style={styles.row}
        onPress={exportContactsToCSV}
      >
        <Text style={styles.rowText}>{t("Export Contacts CSV")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key="remove-all"
        style={[styles.row]}
        onPress={() => setShowConfirmModal(true)}
      >
        <Text style={[styles.rowText]}>{t("Remove All Contacts")}</Text>
      </TouchableOpacity>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("Confirm Deletion")}</Text>
            <Text style={styles.modalText}>
              {t("Are you sure you want to remove all contacts? This action cannot be undone.")}
            </Text>
            <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={() => setShowConfirmModal(false)}>
              <Text style={styles.saveButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cancelButton]} 
              onPress={removeAllContacts}
            >
              <Text style={styles.cancelButtonText}>{t("Delete All")}</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

export default SettingsScreen;
