import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig.js'
import { useNavigation } from '@react-navigation/native'

const RegisterSuccessScreen = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  return (
    <View
        style={styles.container}
        behavior='padding'
    >
      <Text style={styles.title}>Registration Success</Text>
      <Text style={styles.statusText}>Please check verification email before login</Text>
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
  )
}

export default RegisterSuccessScreen 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 20
  },
  buttonContainer: {  
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  button: {
    backgroundColor: 'coral',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  statusText: {
    width: '80%',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18
  }
})