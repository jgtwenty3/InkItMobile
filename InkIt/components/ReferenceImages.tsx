import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const ReferenceImages = () => {
  return (
    <SafeAreaView>
      <Text>ReferenceImages</Text>
      <View>

      </View>
      <View>
      <CustomButton title="add images" buttonStyle = {styles.button} />
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