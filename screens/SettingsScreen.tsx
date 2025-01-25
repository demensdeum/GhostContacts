import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import i18next from "../i18n";
import styles from "../styles";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

const STORAGE_KEY = "@contacts_list";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

      {/* Export Contacts Button */}
      <TouchableOpacity
        key="export-csv"
        style={styles.row}
        onPress={exportContactsToCSV}
      >
        <Text style={styles.rowText}>{t("Export Contacts CSV")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
