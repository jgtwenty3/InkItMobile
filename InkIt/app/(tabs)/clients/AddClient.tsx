import {StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { useGlobalContext } from '@/app/context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { createClient } from '@/lib/appwrite'

const AddClient = () => {

  const {user} = useGlobalContext();
  const [isSubmitting,setSubmission] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city:"",
    state:"",
    country:"",
  })

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setSubmission(true);
    try {
      const newClient = await createClient(form);
      console.log('Client created successfully:', newClient);
      router.push('/clients'); // Redirect to the clients page after successful creation
    } catch (error) {
      console.error('Failed to create client:', error.message);
    } finally {
      setSubmission(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>new client information</Text>
      <FormField
        title="name"
        value={form.fullName}
        handleChangeText={(e) => setForm({ ...form, fullName: e })}
        placeholder="client's full name" 
        otherStyles={{ marginTop: 28, width: '90%' }}
      />
      <FormField
        title="email"
        value={form.email}
        handleChangeText={(e) => setForm({ ...form, email: e })}
        placeholder="client email" 
        otherStyles={{ marginTop: 28, width: '90%' }}
      />
      <FormField
        title="phoneNumber"
        value={form.phoneNumber}
        handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
        placeholder="client's number" 
        otherStyles={{ marginTop: 28, width: '90%' }}
      />
      <FormField
        title="city"
        value={form.city}
        handleChangeText={(e) => setForm({ ...form, city: e })}
        placeholder="city" 
        otherStyles={{ marginTop: 28, width: '90%' }}
      />
      <FormField
        title="state"
        value={form.state}
        handleChangeText={(e) => setForm({ ...form, state: e })}
        placeholder="NY, CA, etc..." 
        otherStyles={{ marginTop: 28, width: '90%' }}
      />
      <FormField
        title="country"
        value={form.country}
        handleChangeText={(e) => setForm({ ...form, country: e })}
        placeholder="USA, Mexico, etc..." 
        otherStyles={{ marginTop: 28, width: '90%' }}
      />

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="add client"
          onPress={handleSubmit}
          buttonStyle={styles.customButton}
          textStyle={styles.customButtonText}
        />
        <CustomButton
          title="cancel"
          onPress={() => router.push('/clients')}
          buttonStyle={styles.customButton}
          textStyle={styles.customButtonText}
        />
      </View>
    </SafeAreaView>
  )
}

export default AddClient

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  customButtonText: {
    fontFamily: 'courier',
    fontSize: 16,
    textAlign: 'center', // Center the text inside the button
  },
  // New styles for button container and buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '90%', // Ensure the container takes up 90% of the width
  },
  customButton: {
    width: '48%', // Make each button take up 48% of the container width
    paddingVertical: 12, // Add vertical padding for better touch area
  },
})
