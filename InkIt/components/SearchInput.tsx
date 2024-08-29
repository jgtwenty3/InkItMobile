import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { usePathname, router } from 'expo-router';

const { width } = Dimensions.get('window');

// Define the props type
interface SearchInputProps {
  onSearch: (query: string) => void; // Add this line
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialQuery }) => { // Update this line
  const pathname = usePathname();
  const [query, setQuery] = useState<string>(initialQuery || '');

  const handleSearch = () => {
    if (query === "") {
      return Alert.alert(
        "Missing Query",
        "Please input something to search results across database"
      );
    }

    onSearch(query); // Call onSearch here

    if (pathname.startsWith("/search")) {
      router.setParams({ query });
    } else {
      router.push(`/search/${query}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="Search client name"
        placeholderTextColor="#CDCDE0"
        onChangeText={(text) => setQuery(text)}
        selectionColor="black"
      />
      <TouchableOpacity onPress={handleSearch}>
        {/* Add any icon or button content here */}
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
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
});
