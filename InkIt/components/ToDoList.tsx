import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { useNavigation } from 'expo-router';
import { getUserToDoList, deleteToDoListItem } from '@/lib/appwrite';
import CustomButton from './CustomButton';
import ToDoModal from './ToDoModal';

const ToDoList = () => {
  const { user } = useGlobalContext();
  const [toDoList, setToDoList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const toDoListData = await getUserToDoList(user.$id);
        
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

  const handleAddToDoItem = () => {
    setModalVisible(true);
  };

  const refreshToDoList = () => {
    if (user && user.$id) {
      getUserToDoList(user.$id).then(setToDoList);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteToDoListItem(itemId);
      // Refresh the list after deletion
      refreshToDoList();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
            <Text style={[styles.toDoText, item.completed && styles.completedText]}>
              {item.item}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.$id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>x</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No To-Do items found.</Text>}
      />
      <View style={styles.buttonView}>
        <CustomButton
          title="Add to List"
          onPress={handleAddToDoItem}
          buttonStyle={styles.button}
        />
      </View>
      <ToDoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={refreshToDoList}
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
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toDoText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'courier',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'white',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  button: {
    marginTop: 20,
    width: 200,
  },
  buttonView: {
    alignItems: 'center',
  },
});

export default ToDoList;
