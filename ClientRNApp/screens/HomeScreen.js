import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation();

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
      <Text>Email: {auth.currentUser?.email}</Text> 
      {/*question mark is there because sometimes currentUser is undefined */}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'coral',
    width: '60%',
    padding: 15,
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