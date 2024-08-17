import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { usePathname, router } from 'expo-router';

const { width } = Dimensions.get('window');

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
        placeholder="search client name"
        placeholderTextColor="#CDCDE0"
        onChangeText={(text) => setQuery(text)}
        selectionColor="black"
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
        
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 10,
  },
  input: {
    height: 40,
    width: width - 50, // Adjust this value to give some space for the icon
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  icon: {
    width: 20, // Equivalent to w-5
    height: 20, // Equivalent to h-5
    marginLeft: 10,
  },
});
