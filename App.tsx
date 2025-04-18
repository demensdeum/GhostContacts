import { ThemeProvider } from './ThemeContext';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordPrompt from './components/PasswordPrompt';
import AppNavigator from './navigation/AppNavigator';
import { ActivityIndicator, View } from 'react-native';
import './i18n';
import { useTranslation } from 'react-i18next';
import bcrypt from "bcryptjs";

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean | null>(null);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const checkStoredPassword = async () => {
      const hash = await AsyncStorage.getItem('app_password');
      setIsPasswordSet(hash !== null && hash.trim().length > 0);
    };

    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
      setIsLanguageLoaded(true);
    };

    checkStoredPassword();
    loadLanguage();
  }, []);

  // Показать загрузку, пока инициализируем язык и проверяем пароль
  if (isPasswordSet === null || !isLanguageLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      </View>
    );
  }

  // Если пароль установлен, но пользователь ещё не аутентифицирован — показать промпт
  if (isPasswordSet && !authenticated) {
    return (
      <PasswordPrompt
      onAuthenticate={(success) => {
        if (success) {
          setAuthenticated(true);
        } else {
          console.warn('Incorrect password');
        }
      }}
      />
    );
  }

  // Всё готово — запускаем приложение
  return (
    <ThemeProvider>
    <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
