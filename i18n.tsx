import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import ru from "./locales/ru.json";

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

const getDeviceLanguage = () => {
  const language = navigator.language || navigator.languages[0];
  if (language.startsWith('ru')) {
    return 'ru';
  }
  return 'en';
};

const loadLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem("language");
  return savedLanguage || getDeviceLanguage();
};

loadLanguage().then((language) => {
  console.log("loadLanguage")
  i18next
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      resources: resources,
      lng: language,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
    console.log("loadLanguage: " + language)
});

export default i18next;
