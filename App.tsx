import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordPrompt from './components/PasswordPrompt';
import AppNavigator from './navigation/AppNavigator';
import { ActivityIndicator, View } from 'react-native';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean | null>(null); // Change to null to track loading state

  useEffect(() => {
    const checkStoredPassword = async () => {
      const password = await AsyncStorage.getItem('app_password');
      setIsPasswordSet(!!password);
    };
    checkStoredPassword();
  }, []);

  // Show a loading indicator while checking AsyncStorage
  if (isPasswordSet === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isPasswordSet && !authenticated) {
    return <PasswordPrompt onAuthenticate={setAuthenticated} />;
  }

  return <AppNavigator />;
};

export default App;
