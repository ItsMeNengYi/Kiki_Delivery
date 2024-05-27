import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'


const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [statusText, setStatusText] = useState(' ')


  const auth = getAuth();
  const navigation = useNavigation();
  
  const handleSignUp = () => {
    if (password == password2) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log("Signed up with: ", user.email);
        })
        .catch(error => alert(error.message))
        .then(() => {
          signOut(auth);
          navigation.replace('RegisterSuccess');
          navigation.reset({
            index: 0,
            routes: [{name: 'RegisterSuccess'}]
          });
        })
    } else {
      alert('Passwords must match')
    }
  }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
      <Text style={styles.title}>New User Registration</Text>
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
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen 

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
  statusText: {
    width: '80%',
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: 12
  }
})