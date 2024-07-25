import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native'


const NewUserDataScreenAndroid = () => {
  const [username, setUsername] = useState('')

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handleUserData = () => {
    if (username == "") {
      alert('Username cannot be empty!')
    } else {
      const userDataRef = collection(FIRESTORE_DB, "user_data")
      setDoc(doc(userDataRef, auth.currentUser.uid), {
        email: auth.currentUser.email,
        username: username,
        time: 0
      })
        .then(() => navigation.replace("Home"))
        .catch(error => alert(error.message))
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/android_login_background.png')} resizeMode='cover' style={styles.backgroundImage}>
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior='padding'
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose a Username</Text>
            <Text style={styles.subtitle}>This can be changed later.</Text>
          </View>
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
              style={[styles.saveButton]}
            >
              <Text style={styles.saveButtonText}>Save Data</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  )
}

const NewUserDataScreenWeb = () => {
  const [username, setUsername] = useState('')

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handleUserData = () => {
    if (username == "") {
      alert('Username cannot be empty!')
    } else {
      const userDataRef = collection(FIRESTORE_DB, "user_data")
      setDoc(doc(userDataRef, auth.currentUser.uid), {
        email: auth.currentUser.email,
        username: username,
        time: 0
      })
        .then(() => navigation.replace("Home"))
        .catch(error => alert(error.message))
    }
  }

  return (
    <View style={webStyles.container}>
      <ImageBackground source={require('../assets/images/web_login_background.jpg')} resizeMode='cover' style={webStyles.backgroundImage}>
        <View
            style={webStyles.whiteContainer}
            behavior='padding'
        >
          <View style={webStyles.titleContainer}>
            <Text style={webStyles.title}>Choose a Username</Text>
            <Text style={webStyles.subtitle}>This can be changed later.</Text>
          </View>
          <View style={webStyles.inputContainer}>
            <TextInput
              placeholder='New username'
              value={username}
              onChangeText={text => setUsername(text)}
              style={webStyles.input}
            />
          </View>
          <View style={webStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handleUserData}
              style={[webStyles.saveButton]}
            >
              <Text style={webStyles.saveButtonText}>Save Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}


var exportedScreen;
if (Platform.OS === 'android') {
  exportedScreen = NewUserDataScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = NewUserDataScreenWeb 
} else {
  exportedScreen = NewUserDataScreenAndroid 
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
    marginBottom: 10
  },
  title: {
    color: 'red',
    fontWeight: '680',
    fontSize: 33,
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
    marginTop: 20,
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
  saveButton: {
    backgroundColor: 'coral',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveButtonText: {
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
  saveButton: {
    backgroundColor: 'coral',
    width: 300,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
})