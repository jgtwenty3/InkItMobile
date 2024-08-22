import { StyleSheet, Text, View, SafeAreaView, FlatList,  } from 'react-native'
import React, { useEffect, useState } from 'react';
 


const messages = () => {
  
  return (
    <SafeAreaView style = {styles.container}>
      <View>
      <Text style ={styles.text}>messages</Text>
      <FlatList/>
    </View>

    </SafeAreaView>
    
  )
}

export default messages

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: "center",
    backgroundColor: 'black',
    color:"white",
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
    marginTop:10
  },
  
})