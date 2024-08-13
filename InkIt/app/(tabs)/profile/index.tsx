import { StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/app/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { signOut } from '@/lib/appwrite'
import { router } from 'expo-router'



const profile = () => {

  const { user, setUser, setIsLogged } = useGlobalContext();
 

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/SignIn");
  };
  return (
    <SafeAreaView style = {styles.container}>
      <View>
        <Text style = {styles.text}>profile</Text>
        <CustomButton
        title = "log out"
        onPress = {logout}
        
        />
      </View>

    </SafeAreaView>
    
  )
}

export default profile

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems:'center',
    backgroundColor: 'black'
  },
  text: {
    fontFamily: 'courier',
    color: 'white'
  },
  
})