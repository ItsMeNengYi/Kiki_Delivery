import { Linking, StyleSheet, Text, TouchableOpacity, View, Platform, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig.js'
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';

const ControlsURL = "https://main.d22eytntr7s98d.amplifyapp.com/control"

const HomeScreenAndroid = () => {
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
      <View style={styles.contentContainer}>
        <Image source={require('../assets/favicon_small_margins.png')} style={styles.logoImage}/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Kiki's Delivery</Text>
          <Text style={styles.subtitle}>Instant Drone Rental Service</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitleText}>Current User Info</Text> 
          <Text style={styles.infoText}>Email: {email}</Text> 
          <Text style={styles.infoText}>Username: {username}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeTitleText}>Usage Time Remaining:</Text>
          <Text style={styles.timeText}>{(time).toFixed(2)} minutes</Text>
          <TouchableOpacity
            onPress={handlePurchaseTime}
            style={styles.timeButton}
          >
            <Text style={styles.timeButtonText}>Purchase Time</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.controlsButton}
            onPress={handleOpenControls}
          >
            <Text style={styles.controlsButtonText}>Access Drone</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity 
          onPress={handleProfile}
          style={styles.profileButton}
        >
          <Text style={styles.profileButtonText}>Profile Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSignOut}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const HomeScreenWeb = () => {
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
    <View style={webStyles.container}>
      <View style={webStyles.headerContainer}>
        <View style={webStyles.headerLeftContainer}>
          <View style={webStyles.headerTitleContainer}>
            <Image source={require('../assets/favicon_small_margins.png')} style={webStyles.logoImage}/>
            <View style={webStyles.headerTitleWordsContainer}>
              <Text style={webStyles.title}>Kiki's Delivery</Text>
              <Text style={webStyles.subtitle}>Instant Drone Rental Service</Text>
            </View>
          </View>

          <View style={webStyles.infoContainer}>
            <Text style={webStyles.infoTitleText}>Current User Info</Text> 
            <Text style={webStyles.infoText}>Email: {email}</Text> 
            <Text style={webStyles.infoText}>Username: {username}</Text>
          </View>
        </View>

        <View style={webStyles.headerButtonContainer}>
          <TouchableOpacity 
            onPress={handleProfile}
            style={webStyles.profileButton}
          >
            <Text style={webStyles.profileButtonText}>Profile Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSignOut}
            style={webStyles.logoutButton}
          >
            <Text style={webStyles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={webStyles.contentContainer}>
        <View style={webStyles.whiteContainer}>
          <Text style={webStyles.timeTitleText}>Usage Time Remaining:</Text>
          <Text style={webStyles.timeText}>{(time).toFixed(2)} minutes</Text>
          <TouchableOpacity
            onPress={handlePurchaseTime}
            style={webStyles.timeButton}
          >
            <Text style={webStyles.timeButtonText}>Purchase Time</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={webStyles.controlsButton}
            onPress={handleOpenControls}
          >
            <Text style={webStyles.controlsButtonText}>Access Drone</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

var exportedScreen;
if (Platform.OS === 'android') {
  exportedScreen = HomeScreenAndroid 
} else if (Platform.OS === 'web') {
  exportedScreen = HomeScreenWeb 
} else {
  exportedScreen = HomeScreenAndroid 
}

export default exportedScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
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
  },
  title: {
    color: 'red',
    fontWeight: '680',
    fontSize: 45,
  },
  subtitle: {
    fontWeight: '680',
    fontSize: 20,
  },

  infoContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    marginTop: 10
  },
  infoTitleText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15
  },

  timeContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  timeTitleText: {
    fontWeight: '500',
    fontSize: 20
  },
  timeText: {
    fontSize: 35
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
  timeButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 16
  },
  

  controlsButton: {
    backgroundColor: 'coral',
    width: '60%',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  controlsButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 25
  },

  footerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  profileButton: {
    backgroundColor: 'coral',
    width: '50%',
    marginBottom: 5,
    padding: 8,
    alignItems: 'center',
    borderRadius: 10
  },
  profileButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15
  },
  logoutButton: {
    backgroundColor: 'white',
    width: '50%',
    padding: 8,
    borderRadius: 10,
    borderColor: 'coral',
    alignItems: 'center',
    borderWidth: 2
  },
  logoutButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 15
  },
})

const webStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerContainer: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    flexDirection: 'row'
  },
  headerLeftContainer: {
    justifyContent: 'left',
    alignItems: 'left',
  },
  headerTitleContainer: {
    justifyContent: 'left',
    alignItems: 'left',
    flexDirection: 'row'
  },
  logoImage: {
    width: 70, 
    height: 70,
    justifyContent: 'center',
    margin: 10
  },
  headerTitleWordsContainer: {
    justifyContent: 'left',
    alignItems: 'left',
    marginLeft: 10
  },
  title: {
    color: 'red',
    fontWeight: '600',
    fontSize: 40,
  },
  subtitle: {
    fontWeight: '580',
    fontSize: 20,
  },

  infoContainer: {
    justifyContent: 'center',
    alignItems: 'left',
    marginTop: 5,
    marginLeft: 10
  },
  infoTitleText: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 15
  },
  
  headerButtonContainer: {  
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: '100%',
    padding: 10
  },
  profileButton: {
    backgroundColor: 'coral',
    width: 150,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10
  },
  profileButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: 'white',
    width: 150,
    padding: 10,
    borderRadius: 10,
    borderColor: 'coral',
    alignItems: 'center',
    borderWidth: 2
  },
  logoutButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 15
  },

  contentContainer: {
    backgroundColor: 'lightgray',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteContainer: {
    backgroundColor: 'white',
    height: '80%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  droneRentalText: {
    fontWeight: '500',
    color: 'red',
    fontSize: 50,
    marginBottom: 30
  },
  timeTitleText: {
    fontWeight: '450',
    fontSize: 25
  },
  timeText: {
    fontSize: 40
  },
  timeButton: {
    backgroundColor: 'white',
    borderColor: 'coral',
    borderWidth: 2,
    width: '50%',
    marginTop: 20,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center'
  },
  timeButtonText: {
    color: 'coral',
    fontWeight: '700',
    fontSize: 20
  },
  

  controlsButton: {
    backgroundColor: 'coral',
    width: '50%',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  controlsButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20
  },
})