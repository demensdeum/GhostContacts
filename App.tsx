import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordPrompt from './components/PasswordPrompt';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);

  useEffect(() => {
    const checkStoredPassword = async () => {
      const password = await AsyncStorage.getItem('app_password');
      setIsPasswordSet(!!password);
    };
    checkStoredPassword();
  }, []);

  if (isPasswordSet && !authenticated) {
    return <PasswordPrompt onAuthenticate={setAuthenticated} />;
  }

  return <AppNavigator />;
};

export default App;
