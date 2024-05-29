import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user.emailVerified) {
        userDataExists()
          .then(exists => {
            if (exists) {
              navigation.replace("Home");
              {/*replace doesnt allow a back button on the status bar*/}
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}]
              });
            } else {
              navigation.replace("NewUserInfo");
              navigation.reset({
                index: 0,
                routes: [{name: 'NewUserInfo'}]
              });
            }
          })
      } else {
        auth.signOut();
        navigation.replace("EmailNotVerified");
      }
    })

    return unsubscribe;
  }, [])

  const handlePasswordReset = () => {
    navigation.navigate("PasswordReset");
  }
  
  const handleSignUp = () => {
    navigation.navigate("Register");
  }

  const userDataExists = async () => {
    const docRef = doc(db, "user_data", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.exists();
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
      })
      .catch(error => alert(error.message));
  }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
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

        <TouchableOpacity
          onPress={handlePasswordReset}
          style={styles.forgotPasswordButton}
        >
          <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
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

export default LoginScreen 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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

  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 15
  },
  forgotPasswordButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'dimgrey'
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
  }
})