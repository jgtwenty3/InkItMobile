import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <Image
            source={require('../../assets/images/inkit.png')}
            style={styles.image}
          />
          <Text style={styles.text}>Create a new account</Text>
          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.mt7}
          />
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.mt7}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter your password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.mt7}
          />
          <CustomButton
            title="Sign Up"
            onPress={() => {
              // Add your sign-up logic here
            }}
            buttonStyle={styles.customButton}
            textStyle={styles.customButtonText}
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Already have an account?"
            onPress={() => router.push('/SignIn')}
            buttonStyle={styles.mt20}
            textStyle={styles.customButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  mt7: {
    marginTop: 28, // Assuming 7*4 = 28 based on typical scaling
  },
  mt20: {
    marginTop: 20,
  },
  customButton: {
    marginTop: 20,
  },
  customButtonText: {
    fontFamily: 'courier',
    fontSize: 16,
  },
});
