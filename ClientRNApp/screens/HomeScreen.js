import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';

const ControlsURL = "https://main.d22eytntr7s98d.amplifyapp.com/control"

const HomeScreen = () => {
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
      })
      .catch(error => alert(error.message));
    }, [])

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

  const handleProfile = () => {
    navigation.navigate('Profile')
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
          alert('30 minutes added to drone usage limit!\n(DEV MODE: no payment implemented yet)');
        });
      })
      .catch(error => alert(error.message));
  }

  const handleOpenControls = () => {
    //cannot start controls if drone time too low
    if (time < 30) {
      alert('Not enough remaining drone time to use! (Must be above 30 min)')
      return;
    }
    
    //handle access code generation and update to firebase
    var currentCode = "00000000"
    const accessCodeDocRef = doc(db, "access_code", "00001");
    const accessCodeRef = collection(FIRESTORE_DB, "access_code")

    getDoc(accessCodeDocRef)
      .then(docSnap => {
        console.log(docSnap.data());
        currentCode = docSnap.data().curr_access_code;
        var finalControlsUrl = ControlsURL + "?email=" + email + "&key=" + currentCode
            Linking.canOpenURL(finalControlsUrl)
              .then((supported) => {
                supported && Linking.openURL(finalControlsUrl);
              }).catch(error => alert(error.message));
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
          <Text style={styles.buttonOutlineText}>Purchase Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlsButton}
          onPress={handleOpenControls}
        >
          <Text style={styles.buttonText}>Access Drone 00001</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleProfile}
        style={styles.profileButton}
      >
        <Text style={styles.buttonText}>Profile Settings</Text>
      </TouchableOpacity>
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
  },
  timeButton: {
    backgroundColor: 'white',
    borderColor: 'coral',
    borderWidth: 2,
    width: '60%',
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center'
  },
  controlsButton: {
    backgroundColor: 'coral',
    width: '60%',
    marginTop: 5,
    marginBottom: 40,
    padding: 20,
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
  profileButton: {
    backgroundColor: 'coral',
    width: '60%',
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  logoutButton: {
    backgroundColor: 'white',
    width: '60%',
    marginBottom: 40,
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