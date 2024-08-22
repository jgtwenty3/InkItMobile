// AddToDoModal.tsx
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createToDoListItem } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';

interface ToDoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const ToDoModal: React.FC<ToDoModalProps> = ({ visible, onClose, onAdd }) => {
  const [item, setItem] = useState('');
  const { user } = useGlobalContext();

  const handleAdd = async () => {
    if (!item.trim()) return;

    try {
      await createToDoListItem({ item });
      onAdd(); // Refresh the list
      setItem(''); // Clear the input field
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to add to-do item:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>add to-do item</Text>
          <TextInput
            style={styles.input}
            placeholder="enter to-do item"
            value={item}
            onChangeText={setItem}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
              <Text style={styles.buttonText}>add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background to match ToDoList
    },
    modalContainer: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: 'black', // Match ToDoList background color
      borderWidth:2,
      borderColor:'white',
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontFamily:"courier",
      marginBottom: 10,
      color: 'white', // Match ToDoList text color
    },
    input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      marginBottom: 15,
      color: 'gray',
      fontFamily:"courier" // Text color to match ToDoList
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 5,
      width: '48%',
      borderWidth:1,
      borderColor:'white'
    },
 
    buttonText: {
      color: 'white', 
      textAlign: 'center',
      fontFamily:"courier"
    },
  });

export default ToDoModal;
