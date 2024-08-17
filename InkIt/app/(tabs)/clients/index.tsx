import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { getUserClients } from '@/lib/appwrite';


const Clients = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const {data:clients} = getUserClients(user.$id)
  console.log(clients)
  console.log(user.$id)
  
  const navigation = useNavigation();
  

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        <SearchInput />
        
      </ScrollView>
      <View>
      <CustomButton
            title="add a new client"
            onPress={() => navigation.navigate('AddClient')}
            buttonStyle={styles.mt20}
            
            
          />
      
      
      </View>
    </SafeAreaView>
  );
};

export default Clients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems:'center'
  },
  innerContainer: {
    flex: 1,
     // Align items to the top
     
    
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
  },
  image: {
    width: 200,  // Set the desired width
    height: 200, // Set the desired height
    resizeMode: 'contain', // Ensure the image maintains its aspect ratio
    marginBottom: 20, // Add some space below the image if needed
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'white',
    backgroundColor: 'white',
  },
  icon: {
    width: 20, // Equivalent to w-5
    height: 20, // Equivalent to h-5
  },
  mt20: {
    marginTop: 20,
  },

});
