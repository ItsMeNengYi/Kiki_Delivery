import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native'


const ProfileScreen = () => {

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

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Current User Email</Text>
        <Text style={styles.subtitle}>{email}</Text>
      </View>

      <View style={styles.usernameContainer}>
        <Text style={styles.title}>Username</Text>
        <TextInput
          placeholder='New username'
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>Drone Time Remaining</Text>
        <Text style={styles.subtitle}>{time} minutes</Text>
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

export default ProfileScreen 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    alignItems: 'left',
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10
  },
  usernameContainer: {
    alignItems: 'left',
    width: '80%',
    paddingHorizontal: 0,
    paddingVertical: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 10
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '450',
    paddingBottom: 10
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