import { StyleSheet, Text, View, Button, TextInput, Image, Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { getCurrentUser,signIn } from '@/lib/appwrite'

const SignIn = () => {

  // const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      // setUser(result);
      // setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style ={styles.container}>
      <Image 
        source={require('../../assets/images/inkit.png')}
        style={styles.image}
      />
      
      <FormField
            title="email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            placeholder="email" 
            otherStyles={{ marginTop: 28 }}
            keyboardType="email-address"
          />

          <FormField
            title="password"
            value={form.password}
            secureTextEntry
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="enter your password" 
            otherStyles={{ marginTop: 28 }}
          />
           <CustomButton
            title="log in"
            onPress={submit}
            buttonStyle={styles.button}
            
            
          />
          
         <CustomButton
          title="create an account"
          onPress={() => router.push('/SignUp')}
          buttonStyle={styles.button}
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
 button: {
    marginTop: 20,
    width:200,
  },
  
});