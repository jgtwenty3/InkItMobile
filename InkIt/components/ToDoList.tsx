import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { useNavigation } from 'expo-router';
import { getUserToDoList } from '@/lib/appwrite';

const ToDoList = () => {
  const { user } = useGlobalContext();
  const [toDoList, setToDoList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const toDoListData = await getUserToDoList(user.$id);
        console.log('To-Do List Data:', toDoListData); // Log the data
        setToDoList(toDoListData);
      } catch (error) {
        setError('Failed to fetch to-do list');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.$id) {
      fetchToDoList();
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Changed color for better visibility
  }

  if (error) {
    Alert.alert('Error', error);
    return <Text style={styles.errorText}>Failed to load To-Do List</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={toDoList}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.toDoItem}>
            <Text style={styles.toDoText}>{item.item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No To-Do items found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black', 
  },
  toDoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor:'white'
    
  },
  toDoText: {
    fontSize: 16,
    color: 'white', 
    fontFamily:'courier'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black', // E
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default ToDoList;
