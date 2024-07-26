import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebaseConfig.js'
import { useNavigation } from '@react-navigation/native'


const RegisterScreenAndroid = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [statusText, setStatusText] = useState(' ')


  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handleSignUp = () => {
    if (password == password2) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log("Signed up with: ", user.email);
          navigation.replace('RegisterSuccess');
          navigation.reset({
            index: 0,
            routes: [{name: 'RegisterSuccess'}]
          });
          signOut(auth);
          sendEmailVerification(user)
            .then(() => {
            })
            .catch(error => alert(error.message))
        })
        .catch(error => alert(error.message))
        .then(() => {
          
          
        })
    } else {
      alert('Passwords must match')
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
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Email'
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              placeholder='Re-enter Password'
              value={password2}
              onChangeText={text => setPassword2(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
          <Text style={styles.statusText}>{statusText}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.registerButton]}
            >
              <Text style={styles.registerButtonText}>Sign Up</Text>
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

const RegisterScreenWeb = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [statusText, setStatusText] = useState(' ')


  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  
  const handleSignUp = () => {
    if (password == password2) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log("Signed up with: ", user.email);
          navigation.replace('RegisterSuccess');
          navigation.reset({
            index: 0,
            routes: [{name: 'RegisterSuccess'}]
          });
          signOut(auth);
          sendEmailVerification(user)
            .then(() => {
            })
            .catch(error => alert(error.message))
        })
        .catch(error => alert(error.message))
        .then(() => {
          
          
        })
    } else {
      alert('Passwords must match')
    }
  }

  const handleBack = () => {
    navigation.navigate("Login");
  }

  return (
    <View style={webStyles.container}>
      <ImageBackground source={require('../assets/images/web_login_background.jpg')} resizeMode='cover' style={styles.backgroundImage}>
        <View
            style={webStyles.whiteContainer}
            behavior='padding'
        >
          <View style={webStyles.titleContainer}>
            <Text style={webStyles.title}>Register</Text>
            <Text style={webStyles.subtitle}>Create a new account</Text>
          </View>
          <View style={webStyles.inputContainer}>
            <TextInput
              placeholder='Email'
              value={email}
              onChangeText={text => setEmail(text)}
              style={webStyles.input}
            />
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={text => setPassword(text)}
              style={webStyles.input}
              secureTextEntry
            />
            <TextInput
              placeholder='Re-enter Password'
              value={password2}
              onChangeText={text => setPassword2(text)}
              style={webStyles.input}
              secureTextEntry
            />
          </View>
          <Text style={webStyles.statusText}>{statusText}</Text>
          <View style={webStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[webStyles.registerButton]}
            >
              <Text style={webStyles.registerButtonText}>Sign Up</Text>
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
  exportedScreen = RegisterScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = RegisterScreenWeb 
} else {
  exportedScreen = RegisterScreenAndroid 
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
    marginBottom: 30
  },
  title: {
    color: 'red',
    fontWeight: '680',
    fontSize: 50,
  },
  subtitle: {
    color: 'dark grey',
    fontWeight: '680',
    fontSize: 20,
  },
  inputContainer: { 
    width: '80%'
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
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  registerButton: {
    backgroundColor: 'coral',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  registerButtonText: {
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
    marginLeft: 40,
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
    flexDirection: 'row'
  },
  registerButton: {
    backgroundColor: 'coral',
    width: 300,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  registerButtonText: {
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