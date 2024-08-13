import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import { useState } from 'react'

const ClientCard = () => {
  return (
    <View style = {styles.container}>
      <Text style = {styles.text}> list of Clients</Text>
    </View>
  )
}

export default ClientCard

const styles = StyleSheet.create({
  text: {
    fontFamily: 'courier',
    color: 'white'
  },
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'black'
  },
})