import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ContactsScreen from '../screens/ContactsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { useTheme } from '../ThemeContext'

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();  
    const [refreshFlag, setRefreshFlag] = useState(false);
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
          tabBarActiveTintColor: theme.buttonBackground,
          tabBarInactiveTintColor: theme.text,
          tabBarStyle: {
            backgroundColor: theme.background,
          },
        })}
      >
<Tab.Screen name={t("Contacts")}>
    {() => <ContactsScreen refreshFlag={refreshFlag} />}
</Tab.Screen>
        <Tab.Screen name={t("Passwords")} component={PasswordScreen} />
<Tab.Screen name={t("Settings")}>
    {() => <SettingsScreen setRefreshFlag={setRefreshFlag} />}
</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
