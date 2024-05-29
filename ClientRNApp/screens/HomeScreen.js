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

  const handleRefresh = () => {
    navigation.replace('Home')
  }

  const handlePurchaseTime = () => {
    const userDataRef = collection(FIRESTORE_DB, "user_data");
    setDoc(doc(userDataRef, auth.currentUser.uid), {
      email: email,
      username: username,
      time: time + 30
    })
      .then(() => {
        getDoc(docRef)
        .then(docSnap => {
          setTime(docSnap.data().time);
          alert('30 minutes added to drone usage limit!\n(DEV MODE: no payment implemented yet')
        });
      })
      .catch(error => alert(error.message));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drone Rental</Text> 
      <TouchableOpacity 
        onPress={handleRefresh}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitleText}>Current User Info</Text> 
        <Text style={styles.infoText}>Email: {email}</Text> 
        <Text style={styles.infoText}>Username: {username}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Drone Time Remaining:</Text>
        <Text style={styles.timeText}>{time} minutes</Text>
        <TouchableOpacity
          onPress={handlePurchaseTime}
          style={styles.timeButton}
        >
          <Text style={styles.buttonText}>Purchase Time</Text>
        </TouchableOpacity>
        <a href="http://localhost:3000">To Control Page</a>
      </View>
      <TouchableOpacity 
        onPress={handleSignOut}
        style={styles.logoutButton}
      >
        <Text style={styles.buttonOutlineText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  title: {
    fontSize: 27,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10
  },
  infoTitleText: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10
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
    margin: 20
  },
  timeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  timeButton: {
    backgroundColor: 'coral',
    width: '60%',
    margin: 25,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  refreshButton: {
    backgroundColor: 'white',
    width: '60%',
    padding: 5,
    borderRadius: 10,
    borderColor: 'coral',
    alignItems: 'center',
    borderWidth: 2
  },
  logoutButton: {
    backgroundColor: 'white',
    width: '60%',
    margin: 40,
    padding: 10,
    borderRadius: 10,
    borderColor: 'coral',
    alignItems: 'center',
    borderWidth: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  refreshButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 14
  },
  buttonOutlineText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 16
  }
})