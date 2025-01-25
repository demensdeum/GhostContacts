import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18next from "../i18n";
import styles from "../styles";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

const LanguageSelectionScreen: React.FC = () => {
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

  if (loading) {
    return (
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>{t("change_language")}</Text>
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
    </View>
  );
};

export default LanguageSelectionScreen;
