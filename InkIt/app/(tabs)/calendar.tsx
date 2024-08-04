import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const calendar = () => {
  return (
    <SafeAreaView style = {styles.container}>
      <View>
      <Text>calendar</Text>
    </View>

    </SafeAreaView>
    
  )
}

export default calendar

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
  
})