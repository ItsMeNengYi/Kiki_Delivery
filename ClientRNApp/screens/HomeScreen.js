import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc, getDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const db = FIRESTORE_DB;
  const docRef = doc(db, "user_data", auth.currentUser.uid);

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [time, setTime] = useState(0)
  getDoc(docRef)
    .then(docSnap => {
      console.log(docSnap.data());
      setEmail(docSnap.data().email);
      setUsername(docSnap.data().username);
      setTime(docSnap.data().time);
    });

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drone Rental</Text> 
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: {email}</Text> 
        <Text style={styles.infoText}>Username: {username}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Drone Time Remaining:</Text>
        <Text style={styles.timeText}>{time} minutes</Text>
      </View>
      <TouchableOpacity 
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  title: {
    fontSize: 27,
    fontWeight: '500',
    paddingBottom: 20
  },
  infoText: {
    fontSize: 17
  },
  timeText: {
    fontSize: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    marginTop: 20
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  button: {
    backgroundColor: 'coral',
    width: '60%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  }
})