import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig.js'
import { useNavigation } from '@react-navigation/native'

const RegisterSuccessScreenAndroid = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/android_login_background.png')} resizeMode='cover' style={styles.backgroundImage}>
        <View
            style={styles.keyboardAvoidingContainer}
            behavior='padding'
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Registration Success</Text>
            <Text style={styles.subtitle}>Please check verification email before login.</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('Login')
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const RegisterSuccessScreenWeb = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  return (
    <View style={webStyles.container}>
      <ImageBackground source={require('../assets/images/web_login_background.jpg')} resizeMode='cover' style={webStyles.backgroundImage}>
        <View
            style={webStyles.whiteContainer}
            behavior='padding'
        >
          <View style={webStyles.titleContainer}>
            <Text style={webStyles.title}>Registration Success</Text>
            <Text style={webStyles.subtitle}>Please check verification email before login.</Text>
          </View>
          <View style={webStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('Login')
              }}
              style={webStyles.button}
            >
              <Text style={webStyles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

var exportedScreen;
if (Platform.OS === 'android') {
  exportedScreen = RegisterSuccessScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = RegisterSuccessScreenWeb 
} else {
  exportedScreen = RegisterSuccessScreenAndroid 
}

export default exportedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'red',
    fontWeight: '680',
    fontSize: 40,
  },
  subtitle: {
    marginTop: 8,
    fontWeight: '680',
    fontSize: 17,
  },
  inputContainer: { 
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'coral',
    fontSize: 16
  },

  buttonContainer: {  
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  button: {
    backgroundColor: 'coral',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
})

const webStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    height: '110%',
    width: '50%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'left',
    marginBottom: 35
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    marginLeft: 50,
    marginBottom: 20
  },
  title: {
    color: 'red',
    fontWeight: '620',
    fontSize: 50,
  },
  subtitle: {
    color: 'dark grey',
    fontWeight: '620',
    fontSize: 20,
  },
  inputContainer: { 
    width: '60%',
    marginLeft: 40
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: 'coral',
    fontSize: 16
  },

  buttonContainer: {  
    justifyContent: 'left',
    alignItems: 'left',
    marginLeft: 40,
    marginTop: 15,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'coral',
    width: 300,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
})