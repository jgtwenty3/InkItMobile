import { Text, View, StyleSheet, Image, Button } from "react-native";
import { StatusBar } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "./context/GlobalProvider";
import CustomButton from "@/components/CustomButton";



export default function App() {

  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/images/inkit.png')}
        style={styles.image}
      />
      <StatusBar />
      <CustomButton title = "login"   onPress={()=>router.push("/SignIn")}/>
      <CustomButton title = "sign up"  onPress={()=>router.push("/SignUp")}/>
      
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
