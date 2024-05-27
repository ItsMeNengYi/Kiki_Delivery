import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterSuccessScreen from './screens/RegisterSuccessScreen';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArva7PR9W7Sl6O03H3JvGztURqzKDMPd8",
  authDomain: "kikisdelivery-44503.firebaseapp.com",
  databaseURL: '',
  projectId: "kikisdelivery-44503",
  storageBucket: "kikisdelivery-44503.appspot.com",
  messagingSenderId: "61734388843",
  appId: "1:61734388843:web:101c249fa585e8b0319d2e",
  measurementId: "G-90K7ETW99H"
};

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Initialize Firebase Authentication and get a reference to the service
const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false }} name="RegisterSuccess" component={RegisterSuccessScreen} />
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