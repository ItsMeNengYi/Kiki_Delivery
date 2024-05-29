import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native'


const NewUserDataScreen = () => {
  const [username, setUsername] = useState('')

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handleUserData = () => {
    if (username == "") {
      alert('Username cannot be empty!')
    } else {
      const userInfoRef = collection(FIRESTORE_DB, "user_data")
      setDoc(doc(userInfoRef, auth.currentUser.uid), {
        email: auth.currentUser.email,
        username: username,
        time: 0
      })
        .then(() => navigation.replace("Home"))
        .catch(error => alert(error.message))
    }
  }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
      <Text style={styles.welcome}>Welcome</Text>
      <Text style={styles.title}>Enter A Username</Text>
      <Text style={styles.subtitle}>This can be changed later.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='New username'
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleUserData}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Save Data</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default NewUserDataScreen 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 30,
    fontWeight: '500',
    paddingBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 10
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '450',
    paddingBottom: 20
  },
  inputContainer: { 
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5
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
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'coral',
    borderWidth: 2
  },

  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  buttonOutlineText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 16
  },
})