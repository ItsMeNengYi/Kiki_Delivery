import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterSuccessScreen from './screens/RegisterSuccessScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import PasswordResetSuccessScreen from './screens/PasswordResetSuccessScreen';
import EmailNotVerfiedScreen from './screens/EmailNotVerifiedScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false }} name="RegisterSuccess" component={RegisterSuccessScreen} />
        <Stack.Screen options={{ headerTitle: 'Password Reset' }} name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen options={{ headerShown: false }} name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EmailNotVerified" component={EmailNotVerfiedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;