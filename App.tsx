import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PasswordPrompt from "./components/PasswordPrompt";
import AppNavigator from "./navigation/AppNavigator";
import { ActivityIndicator, View } from "react-native";
import "./i18n";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from './ThemeContext';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean | null>(null);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const checkStoredPassword = async () => {
      const password = await AsyncStorage.getItem("app_password");
      setIsPasswordSet(!!password);
    };

    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      console.log(savedLanguage)
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
      setIsLanguageLoaded(true);
    };

    checkStoredPassword();
    loadLanguage();
  }, []);

  // Show loading indicator while checking AsyncStorage
  if (isPasswordSet === null || !isLanguageLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isPasswordSet && !authenticated) {
    return <PasswordPrompt onAuthenticate={setAuthenticated} />;
  }

  return <ThemeProvider><AppNavigator /></ThemeProvider>;
};

export default App;
