import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

const messages = () => {
  return (
    <SafeAreaView style = {styles.container}>
      <View>
      <Text style ={styles.text}>messages</Text>
    </View>

    </SafeAreaView>
    
  )
}

export default messages

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'black',
    color:"white",
  },
  text: {
    fontFamily: 'courier',
    color: 'white'
  },
  
})