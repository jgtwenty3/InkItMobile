import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCurrentUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/app/context/GlobalProvider'

const EditProfile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        

      </View>
    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight:20,
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
    marginBottom: 10,
  },
  header: {
    fontFamily: 'courier',
    color: 'white',
    fontWeight: 'bold', // Makes the text bold
    fontSize: 24, // Adjust the font size as needed
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 16,
    width: '50%', // Adjust the width as needed
    alignSelf: 'center', // Center the button container horizontally
    marginBottom: 16, // Add space from the bottom
  },
});