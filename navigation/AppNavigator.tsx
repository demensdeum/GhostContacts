import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ContactsScreen from '../screens/ContactsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide the header if not needed
          tabBarIcon: ({ color, size }) => {
            let iconName: string = 'ellipse'; // Default icon

            if (route.name === 'Contacts') {
              iconName = 'person-outline';
            } else if (route.name === 'Password') {
              iconName = 'lock-closed-outline';
            } else if (route.name === 'Settings') {
              iconName = 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Contacts" component={ContactsScreen} />
        <Tab.Screen name="Password" component={PasswordScreen} />
        <Tab.Screen name="Settings" component={LanguageSelectionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
