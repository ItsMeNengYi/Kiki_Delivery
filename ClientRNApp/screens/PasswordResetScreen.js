import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig.js'
import { useNavigation } from '@react-navigation/native'


const PasswordResetScreenAndroid = () => {
  const [email, setEmail] = useState('')

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handlePasswordReset = () => {
    if (email == "") {
      alert('Email cannot be empty!')
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => navigation.replace("PasswordResetSuccess"))
        .catch(error => alert(error.message))
    }
  }

  const handleBack = () => {
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/android_login_background.png')} resizeMode='cover' style={styles.backgroundImage}>
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior='padding'
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Password Reset</Text>
            <Text style={styles.subtitle}>A password reset email will be sent.</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Email'
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handlePasswordReset}
              style={[styles.passwordResetButton]}
            >
              <Text style={styles.passwordResetButtonText}>Send Reset Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.backButton]}
            >
              <Text style={styles.backButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  )
}

const PasswordResetScreenWeb = () => {
  const [email, setEmail] = useState('')

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handlePasswordReset = () => {
    if (email == "") {
      alert('Email cannot be empty!')
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => navigation.replace("PasswordResetSuccess"))
        .catch(error => alert(error.message))
    }
  }

  const handleBack = () => {
    navigation.navigate("Login");
  }

  return (
    <View style={webStyles.container}>
      <ImageBackground source={require('../assets/images/web_login_background.jpg')} resizeMode='cover' style={webStyles.backgroundImage}>
        <View
            style={webStyles.whiteContainer}
            behavior='padding'
        >
          <View style={webStyles.titleContainer}>
            <Text style={webStyles.title}>Password Reset</Text>
            <Text style={webStyles.subtitle}>A password reset email will be sent.</Text>
          </View>
          <View style={webStyles.inputContainer}>
            <TextInput
              placeholder='Email'
              value={email}
              onChangeText={text => setEmail(text)}
              style={webStyles.input}
            />
          </View>
          <View style={webStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handlePasswordReset}
              style={[webStyles.passwordResetButton]}
            >
              <Text style={webStyles.passwordResetButtonText}>Send Reset Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBack}
              style={[webStyles.backButton]}
            >
              <Text style={webStyles.backButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

var exportedScreen;
if (Platform.OS === 'android') {
  exportedScreen = PasswordResetScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = PasswordResetScreenWeb 
} else {
  exportedScreen = PasswordResetScreenAndroid 
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
    color: 'red',
    fontWeight: '680',
    fontSize: 40,
  },
  subtitle: {
    fontWeight: '680',
    fontSize: 18,
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
    marginTop: 20
  },
  passwordResetButton: {
    backgroundColor: 'coral',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  passwordResetButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  backButton: {
    marginTop: 5,
    backgroundColor: 'white',
    width: '100%',
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'coral',
    alignItems: 'center'
  },
  backButtonText: {
    color: 'coral',
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
  passwordResetButton: {
    backgroundColor: 'coral',
    width: 300,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  passwordResetButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  backButton: {
    backgroundColor: 'white',
    width: 200,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'coral',
    alignItems: 'center',
    marginLeft: 10
  },
  backButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 16
  },
})