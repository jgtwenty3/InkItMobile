import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const home = () => {
  return (
   <SafeAreaView style = {styles.container}>
    {/* <FlatList
    data={[]}
    /
    
    /> */}
   </SafeAreaView>
  )
}

export default home

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