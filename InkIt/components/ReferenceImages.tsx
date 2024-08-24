import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { getUserAppointments } from '@/lib/appwrite'

const ReferenceImages = () => {
  return (
    <SafeAreaView>
      <Text>ReferenceImages</Text>
      <View>

      </View>
      
    </SafeAreaView>
  )
}

export default ReferenceImages

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    width:200,
    marginLeft:5,
  },
})