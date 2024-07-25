import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native'

const LoginScreenAndroid = () => {
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
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/android_login_background.png')} resizeMode='cover' style={styles.backgroundImage}>
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior='padding'
        >
          <Image source={require('../assets/favicon_small_margins.png')} style={styles.logoImage}/>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Please login to continue.</Text>
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
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.registerButton]}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePasswordReset}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  )
}

const LoginScreenWeb = () => {
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
    <View style={webStyles.container}>
      <ImageBackground source={require('../assets/images/web_login_background.jpg')} resizeMode='cover' style={webStyles.backgroundImage}>
        <View
            style={webStyles.whiteContainer}
            behavior='padding'
        >
          <Image source={require('../assets/favicon_small_margins.png')} style={webStyles.logoImage}/>
          <View style={webStyles.titleContainer}>
            <Text style={webStyles.title}>Welcome</Text>
            <Text style={webStyles.subtitle}>Please login to continue.</Text>
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
          </View>

          <View style={webStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={webStyles.loginButton}
            >
              <Text style={webStyles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[webStyles.registerButton]}
            >
              <Text style={webStyles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
              onPress={handlePasswordReset}
              style={webStyles.forgotPasswordButton}
            >
              <Text style={webStyles.forgotPasswordButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

var exportedScreen;
if (Platform.OS === 'android') {
  exportedScreen = LoginScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = LoginScreenWeb 
} else {
  exportedScreen = LoginScreenAndroid 
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
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  logoImage: {
    width: 90, 
    height: 90,
    justifyContent: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
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
  loginButton: {
    backgroundColor: 'coral',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  registerButton: {
    marginTop: 5,
    backgroundColor: 'white',
    width: '100%',
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'coral',
    alignItems: 'center'
  },
  registerButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 16
  },

  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 15
  },
  forgotPasswordButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'dimgrey',
    textDecorationLine: 'underline'
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
  logoImage: {
    width: 120, 
    height: 120,
    justifyContent: 'center',
    marginLeft: 30
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    marginLeft: 30,
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
    marginLeft: 30
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
    marginTop: 10,
    marginLeft: 30,
    flexDirection: 'row'
  },
  loginButton: {
    backgroundColor: 'coral',
    width: 200,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  registerButton: {
    backgroundColor: 'white',
    width: 200,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'coral',
    alignItems: 'center',
    marginLeft: 10
  },
  registerButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 16
  },

  forgotPasswordButton: {
    alignItems: 'left',
    marginTop: 15,
    marginLeft: 30,
    marginBottom: 50
  },
  forgotPasswordButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'dimgrey',
    textDecorationLine: 'underline'
  },
})