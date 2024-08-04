import { Slot, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import GlobalProvider from "./context/GlobalProvider";



export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name = "index" options = {{headerShown: false}}/>
        <Stack.Screen name = "(auth)"options = {{headerShown: false}}/>
        <Stack.Screen name = "(tabs)"options = {{headerShown: false}}/>
        {/* <Stack.Screen name = "/search/[query]"options = {{headerShown: false}}/> */}
      </Stack>
    </GlobalProvider>
      
  )
}


