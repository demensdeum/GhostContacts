import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ContactsScreen from '../screens/ContactsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    const { t } = useTranslation();  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide the header if not needed
          tabBarIcon: ({ color, size }) => {
            let iconName: string = 'ellipse'; // Default icon

            if (route.name === t('Contacts')) {
              iconName = 'person-outline';
            } else if (route.name === t('Passwords')) {
              iconName = 'lock-closed-outline';
            } else if (route.name === t('Settings')) {
              iconName = 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name={t("Contacts")} component={ContactsScreen} />
        <Tab.Screen name={t("Passwords")} component={PasswordScreen} />
        <Tab.Screen name={t("Settings")} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
