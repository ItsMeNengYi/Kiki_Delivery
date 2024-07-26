import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native'


const ProfileScreenAndroid = () => {

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const db = FIRESTORE_DB;
  const docRef = doc(db, "user_data", auth.currentUser.uid);

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [time, setTime] = useState(0)

  useEffect(() =>
    {
      getDoc(docRef)
      .then(docSnap => {
        console.log(docSnap.data());
        setEmail(docSnap.data().email);
        setUsername(docSnap.data().username);
        setTime(docSnap.data().time);
      });
    }, [])
  
  const handleUserData = () => {
    if (username == "") {
      alert('Username cannot be empty!')
    } else {
      const userDataRef = collection(FIRESTORE_DB, "user_data")
      updateDoc(doc(userDataRef, auth.currentUser.uid), {
        username: username,
      })
        .then(() => {
          navigation.replace("Home");
              {/*replace doesnt allow a back button on the status bar*/}
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}]
              });
        })
        .catch(error => alert(error.message))
    }
  }

  const handleBack = () => {
    navigation.navigate("Home");
  }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
      <Image source={require('../assets/favicon_small_margins.png')} style={styles.logoImage}/>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Current User Email</Text>
        <Text style={styles.infoText}>{email}</Text>
      </View>

      <View style={styles.usernameContainer}>
        <Text style={styles.infoTitle}>Username</Text>
        <TextInput
          placeholder='New username'
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.usernameInput}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Drone Time Remaining</Text>
        <Text style={styles.infoText}>{time} minutes</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleUserData}
          style={[styles.saveButton]}
        >
          <Text style={styles.saveButtonText}>Save Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton]}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const ProfileScreenWeb = () => {

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const db = FIRESTORE_DB;
  const docRef = doc(db, "user_data", auth.currentUser.uid);

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [time, setTime] = useState(0)

  useEffect(() =>
    {
      getDoc(docRef)
      .then(docSnap => {
        console.log(docSnap.data());
        setEmail(docSnap.data().email);
        setUsername(docSnap.data().username);
        setTime(docSnap.data().time);
      });
    }, [])
  
  const handleUserData = () => {
    if (username == "") {
      alert('Username cannot be empty!')
    } else {
      const userDataRef = collection(FIRESTORE_DB, "user_data")
      updateDoc(doc(userDataRef, auth.currentUser.uid), {
        username: username,
      })
        .then(() => {
          navigation.replace("Home");
              {/*replace doesnt allow a back button on the status bar*/}
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}]
              });
        })
        .catch(error => alert(error.message))
    }
  }

  const handleBack = () => {
    navigation.navigate("Home");
  }

  return (
    <KeyboardAvoidingView
        style={webStyles.container}
        behavior='padding'
    >
      <View style={webStyles.whiteContainer}>
        <Image source={require('../assets/favicon_small_margins.png')} style={webStyles.logoImage}/>
        <View style={webStyles.titleContainer}>
          <Text style={webStyles.title}>Profile</Text>
        </View>

        <View style={webStyles.infoContainer}>
          <Text style={webStyles.infoTitle}>Current User Email</Text>
          <Text style={webStyles.infoText}>{email}</Text>
        </View>

        <View style={webStyles.usernameContainer}>
          <Text style={webStyles.infoTitle}>Username</Text>
          <TextInput
            placeholder='New username'
            value={username}
            onChangeText={text => setUsername(text)}
            style={webStyles.usernameInput}
          />
        </View>

        <View style={webStyles.infoContainer}>
          <Text style={webStyles.infoTitle}>Drone Time Remaining</Text>
          <Text style={webStyles.infoText}>{time} minutes</Text>
        </View>
        
        <View style={webStyles.buttonContainer}>
          <TouchableOpacity
            onPress={handleUserData}
            style={[webStyles.saveButton]}
          >
            <Text style={webStyles.saveButtonText}>Save Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBack}
            style={[webStyles.backButton]}
          >
            <Text style={webStyles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

var exportedScreen;
if (Platform.OS === 'android') {
  exportedScreen = ProfileScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = ProfileScreenWeb 
} else {
  exportedScreen = ProfileScreenAndroid 
}

export default exportedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
    fontSize: 45,
  },

  infoContainer: {
    alignItems: 'left',
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 18
  },
  
  usernameContainer: {
    alignItems: 'left',
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10
  },
  usernameInput: {
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
    marginTop: 40
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray'
  },
  whiteContainer: {
    backgroundColor: 'white',
    height: '90%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
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
    fontSize: 45,
  },

  infoContainer: {
    alignItems: 'left',
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 18
  },
  
  usernameContainer: {
    alignItems: 'left',
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10
  },
  usernameInput: {
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
    marginTop: 40
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