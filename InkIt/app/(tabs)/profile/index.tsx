import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import CustomButton from '@/components/CustomButton';
import { signOut } from '@/lib/appwrite';
import { router } from 'expo-router';
import { useGoogleAuth } from '@/lib/GoogleAuth';

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { promptAsync } = useGoogleAuth(); // Use the hook here

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace('/SignIn');
  };

  const handleGoogleLogin = async () => {
    if (promptAsync) {
      await promptAsync();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>{user.username}'s Profile</Text>
        <Text style={styles.text}>{user.email}</Text>
        <CustomButton title="edit profile" onPress={() => router.push('profile/EditProfile')} />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title="Log out" onPress={logout} />
        <CustomButton title="Log in with Google" onPress={handleGoogleLogin} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight:20,
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
    marginBottom: 10,
  },
  header: {
    fontFamily: 'courier',
    color: 'white',
    fontWeight: 'bold', // Makes the text bold
    fontSize: 24, // Adjust the font size as needed
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 16,
    width: '50%', // Adjust the width as needed
    alignSelf: 'center', // Center the button container horizontally
    marginBottom: 16, // Add space from the bottom
  },
});
