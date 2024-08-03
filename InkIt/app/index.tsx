import { Text, View, StyleSheet, Image, Button } from "react-native";
import { StatusBar } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";



export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/images/inkit.png')}
        style={styles.image}
      />
      <StatusBar/>
      <Button title = "Login" color = "white"  onPress={()=>router.push("/SignIn")}/>
      <Button title = "Sign Up" color = "white" onPress={()=>router.push("/SignUp")}/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'black'
  },
  text: {
    fontFamily: 'courier',
    color: 'white'
  },
  image: {
    width: 200,  // Set the desired width
    height: 200, // Set the desired height
    resizeMode: 'contain', // Ensure the image maintains its aspect ratio
    marginBottom: 20 // Add some space below the image if needed
  },
});
