import { StyleSheet, Text, View, Button, TextInput, Image} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'

const SignIn = () => {

  // const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView style ={styles.container}>
      <Image 
        source={require('../../assets/images/inkit.png')}
        style={styles.image}
      />
      <Text style ={styles.text}>log in to Ink It</Text>
      <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
         <CustomButton
          title="or create an account"
          onPress={() => router.push('/SignUp')}
          
        />
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    flex: 1, // take up the entire screen
    justifyContent: 'center', // center vertically
    alignItems: 'center', // center horizontally
    backgroundColor: 'black',
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color:'white',
  },
  image: {
    width: 200,  // Set the desired width
    height: 200, // Set the desired height
    resizeMode: 'contain', // Ensure the image maintains its aspect ratio
    marginBottom: 20 // Add some space below the image if needed
  },
  
});