import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ContactsScreen from '../screens/ContactsScreen';
import PasswordScreen from '../screens/PasswordScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Contacts" component={ContactsScreen} />
        <Tab.Screen name="Password" component={PasswordScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
