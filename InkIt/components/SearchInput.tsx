import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet } from 'react-native';
import { usePathname, router } from 'expo-router';




// Define the props type
interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState<string>(initialQuery || '');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="search clients"
        placeholderTextColor="#CDCDE0"
        onChangeText={(text) => setQuery(text)}
      />
      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={require('../assets/images/searchicon.png')}style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color:'black',
        backgroundColor:'white'
      },
      icon: {
        width: 20, // Equivalent to w-5
        height: 20, // Equivalent to h-5
      },
  });
