import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'

const clients = () => {
  return (
    <SafeAreaView style ={styles.container}>
      <View >
          <Text>clients</Text>
          <SearchInput/>
      </View>
    </SafeAreaView>
    
  )
}

export default clients

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'black'
  },
  text: {
    fontFamily: 'courier',
    color: 'white'
  },
  image: {
    width: 200,  // Set the desired width
    height: 200, // Set the desired height
    resizeMode: 'contain', // Ensure the image maintains its aspect ratio
    marginBottom: 20 // Add some space below the image if needed
  },
  input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      color:'white',
    },
    icon: {
      width: 20, // Equivalent to w-5
      height: 20, // Equivalent to h-5
    },
});
